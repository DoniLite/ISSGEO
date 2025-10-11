import { BaseService } from '@/core/base.service';
import type { UserTableType } from '@/db';
import {
  CreateUserDto,
  LoginDTO,
  UpdateUserDto,
  UpdateUserPasswordDTO,
} from '../DTO/user.dto';
import { UserRepository } from '../repository/user.repository';
import type { Context } from 'hono';
import { Service, ValidateDTO } from '@/core/decorators';
import { compareHash, hashSomething } from '@/api/helpers/hash';
import { HTTPException } from 'hono/http-exception';
import { sign } from 'hono/jwt';
import { setCookie } from 'hono/cookie';

@Service()
export class UserService extends BaseService<
  UserTableType,
  CreateUserDto,
  UpdateUserDto,
  UserRepository
> {
  constructor() {
    super(new UserRepository());
  }

  @ValidateDTO(CreateUserDto)
  override async create(
    dto: CreateUserDto,
    _context: Context
  ): Promise<UserTableType> {
    const hashedPassword = await hashSomething(dto.password);

    return this.repository.create({
      ...dto,
      password: hashedPassword,
    });
  }

  @ValidateDTO(UpdateUserDto)
  override async update(
    id: string | number,
    dto: UpdateUserDto,
    _context: Context
  ): Promise<UserTableType[] | null> {
    return this.repository.update(id, dto);
  }

  @ValidateDTO(LoginDTO)
  async login(
    dto: LoginDTO,
    context: Context
  ): Promise<
    Pick<UserTableType, 'id' | 'email' | 'name' | 'image'> & { token: string }
  > {
    const res = await this.findOneBy('email', dto.email);

    if (!res) {
      throw new HTTPException(404, {
        message: "The user doesn't exist",
      });
    }

    const isValidPassword = await compareHash(dto.password, res.password);

    if (!isValidPassword) {
      throw new HTTPException(401, {
        message: "You're not authorized",
      });
    }

    const expireDate = new Date();
    expireDate.setHours(expireDate.getHours() + 5);

    const payload = {
      userId: res.id,
      role: res.role,
      exp: expireDate.getTime(),
    };

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new HTTPException(500, {
        message: 'some data are missing for this operation \n => JWT_SECRET',
      });
    }

    const token = await sign(payload, secret);

    setCookie(context, 'session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      path: '/',
      maxAge: 60 * 60 * 5,
    });

    return {
      id: res.id,
      email: res.email,
      name: res.name,
      image: res.image,
      token,
    };
  }

  @ValidateDTO(UpdateUserPasswordDTO)
  async updatePassword(
    dto: UpdateUserPasswordDTO,
    _context: Context
  ): Promise<{ validated: true; rows: number }> {
    const res = await this.findOneBy('id', dto.id);

    if (!res) {
      throw new HTTPException(404, {
        message: "The user doesn't exist",
      });
    }

    const isValidPassword = await compareHash(
      dto.previousPassword,
      res.password
    );

    if (!isValidPassword) {
      throw new HTTPException(401, {
        message: "You're not authorized",
      });
    }

    const newPassword = await hashSomething(dto.newPassword);

    try {
      const update = await this.repository.update(dto.id, {
        password: newPassword,
      });

      if (!update) {
        throw new HTTPException(400, {
          message: 'The operation failed',
        });
      }

      return {
        validated: true,
        rows: update.length,
      };
    } catch (e) {
      throw new HTTPException(400, {
        cause: e,
      });
    }
  }
}

import type { Context, Hono, MiddlewareHandler } from 'hono';
import type { BaseService } from './base.service';
import type { BaseEntity } from './types/base';
import type { PaginationQuery } from '@/lib/interfaces/pagination';
import buildQuery from '@/api/helpers/buildQuery';
import type { Variables } from '@/factory/web.factory';

export interface RouteMiddlewares {
  all?: MiddlewareHandler[];
  get?: MiddlewareHandler[];
  post?: MiddlewareHandler[];
  patch?: MiddlewareHandler[];
  delete?: MiddlewareHandler[];
  getById?: MiddlewareHandler[];
  stats?: MiddlewareHandler[];
  [key: `${string}`]: MiddlewareHandler[] | undefined;
}

export interface ControllerOptions {
  middlewares?: RouteMiddlewares;
  excludeRoutes?: (
    | 'list'
    | 'create'
    | 'update'
    | 'delete'
    | 'deleteMultiple'
    | 'getById'
    | 'stats'
  )[];
}

export abstract class BaseController<
  T extends BaseEntity,
  CreateDTO extends object,
  UpdateDTO extends object,
  // biome-ignore lint/suspicious/noExplicitAny: <>
  Service extends BaseService<T, CreateDTO, UpdateDTO, any>,
> {
  protected service: Service;
  protected app: Hono<{ Variables: Variables }>;
  protected options: ControllerOptions;

  constructor(
    service: Service,
    app: Hono<{ Variables: Variables }>,
    options: ControllerOptions = {}
  ) {
    this.service = service;
    this.app = app;
    this.options = {
      middlewares: options.middlewares || {},
      excludeRoutes: options.excludeRoutes || [],
    };

    this.registerRoutes();
  }

  protected registerCustomRoutes(): void {}

  /**
   * Register all CRUD routes with their middlewares
   */
  private registerRoutes(): void {
    const { middlewares = {}, excludeRoutes = [] } = this.options;

    // Apply global middlewares if any
    if (middlewares.all && middlewares.all.length > 0) {
      this.app.use('*', ...middlewares.all);
    }

    this.registerCustomRoutes();

    // GET / - List with pagination
    if (!excludeRoutes.includes('list')) {
      const getMiddlewares = [...(middlewares.get || [])];
      this.app.get('/', ...getMiddlewares, (c) => this.list(c));
    }

    // GET /stats - Statistics
    if (!excludeRoutes.includes('stats')) {
      const statsMiddlewares = [...(middlewares.stats || [])];
      this.app.get('/stats', ...statsMiddlewares, (c) => this.getStatistics(c));
    }

    // GET /:id - Get by ID
    if (!excludeRoutes.includes('getById')) {
      const getByIdMiddlewares = [...(middlewares.getById || [])];
      this.app.get('/:id', ...getByIdMiddlewares, (c) => this.getById(c));
    }

    // POST / - Create
    if (!excludeRoutes.includes('create')) {
      const postMiddlewares = [...(middlewares.post || [])];
      this.app.post('/', ...postMiddlewares, (c) => this.create(c));
    }

    // PATCH /:id - Update
    if (!excludeRoutes.includes('update')) {
      const patchMiddlewares = [...(middlewares.patch || [])];
      this.app.patch('/:id', ...patchMiddlewares, (c) => this.update(c));
    }

    // DELETE /:id - Delete single
    if (!excludeRoutes.includes('delete')) {
      const deleteMiddlewares = [...(middlewares.delete || [])];
      this.app.delete('/:id', ...deleteMiddlewares, (c) =>
        this.deleteSingle(c)
      );
    }

    // DELETE / - Delete multiple (via query params or body)
    if (!excludeRoutes.includes('deleteMultiple')) {
      const deleteMiddlewares = [...(middlewares.delete || [])];
      this.app.delete('/', ...deleteMiddlewares, (c) => this.deleteMultiple(c));
    }

  }

  /**
   * GET / - List entities with pagination
   */
  protected async list(c: Context) {
    try {
      const query = buildQuery(c.req.query()) as PaginationQuery;
      const result = await this.service.findPaginated(query);
      return c.json(result);
    } catch (error) {
      return this.handleError(c, error);
    }
  }

  /**
   * GET /:id - Get entity by ID
   */
  protected async getById(c: Context) {
    try {
      const id = c.req.param('id');
      const result = await this.service.findById(id);

      if (!result) {
        return c.notFound();
      }

      return c.json(result);
    } catch (error) {
      return this.handleError(c, error);
    }
  }

  /**
   * POST / - Create new entity
   */
  protected async create(c: Context) {
    try {
      const dto = await c.req.json();
      const result = await this.service.create(dto as CreateDTO, c);

      if (!result) {
        return c.notFound();
      }

      return c.json(result, 201);
    } catch (error) {
      return this.handleError(c, error);
    }
  }

  /**
   * PATCH /:id - Update entity
   */
  protected async update(c: Context) {
    try {
      const id = c.req.param('id');
      const dto = await c.req.json();

      const result = await this.service.update(id, dto as UpdateDTO, c);

      if (!result) {
        return c.notFound();
      }

      return c.json({
        updated: true,
        rows: result.length,
        data: result,
      });
    } catch (error) {
      return this.handleError(c, error);
    }
  }

  /**
   * DELETE /:id - Delete single entity
   */
  protected async deleteSingle(c: Context) {
    try {
      const id = c.req.param('id');
      const result = await this.service.delete(id);

      if (!result) {
        return c.notFound();
      }

      return c.json({ deleted: true, id });
    } catch (error) {
      return this.handleError(c, error);
    }
  }

  /**
   * DELETE / - Delete multiple entities
   * Accepts IDs via query params (?ids=1,2,3) or body ({ ids: [1,2,3] })
   */
  protected async deleteMultiple(c: Context) {
    try {
      let ids: (string | number)[] = [];

      // Try to get IDs from query params first
      const queryIds = c.req.query('ids');
      if (queryIds) {
        ids = queryIds.split(',').map((id) => id.trim());
      } else {
        // Try to get IDs from body
        const body = await c.req.json();
        ids = body.ids || [];
      }

      if (ids.length === 0) {
        return c.json(
          {
            error: 'No IDs provided',
            message:
              'Please provide IDs via query params (?ids=1,2,3) or body ({ ids: [1,2,3] })',
          },
          400
        );
      }

      const result = await this.service.deleteMultiple(ids);

      return c.json({
        deleted: result.success,
        deletedCount: result.deletedCount,
        requestedCount: result.requestedCount,
        message: result.success
          ? `Successfully deleted ${result.deletedCount} entities`
          : `Deleted ${result.deletedCount} out of ${result.requestedCount} entities`,
      });
    } catch (error) {
      return this.handleError(c, error);
    }
  }

  /**
   * GET /stats - Get statistics
   */
  protected async getStatistics(c: Context) {
    try {
      const stats = await this.service.getStatistics();
      return c.json(stats);
    } catch (error) {
      return this.handleError(c, error);
    }
  }

  /**
   * Handle errors in a consistent way
   */
  protected handleError(c: Context, error: unknown) {
    console.error('Controller Error:', error);

    if (error instanceof Error) {
      return c.json(
        {
          error: error.message,
          name: error.name,
        },
        500
      );
    }

    return c.json(
      {
        error: 'An unexpected error occurred',
      },
      500
    );
  }

  /**
   * Get the Hono app instance
   */
  public getApp(): Hono<{ Variables: Variables }> {
    return this.app;
  }
}

import 'reflect-metadata';
import { SeederRunner } from './runer';
import { TestimonialsSeeder } from './testimonials.seed';
import { UserSeeder } from './user.seed';

async function run() {
  const runner = new SeederRunner([TestimonialsSeeder, UserSeeder]);

  await runner.runAll();
}

run();

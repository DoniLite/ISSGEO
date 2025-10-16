

export class SeederRunner<
  // biome-ignore lint/suspicious/noExplicitAny: <>
  C extends new () => any,
> {
  constructor(protected seeders: C[]) {}

  async runAll() {
    for (const seeder of this.seeders) {
      const seederInstance = new seeder();
      await seederInstance.run();
    }
  }
}

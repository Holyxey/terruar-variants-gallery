import { getSchemaValidator, type TSchema, type Static } from 'elysia';

enum KEYS {
  gallerySlug = 'g',
  vueFile = 'v',
}

export class RedisCache<
  T extends TSchema,
  K extends Extract<keyof Static<T>, string> = never,
> {
  private key: string;
  private validator;

  constructor(
    domain: keyof typeof KEYS,
    tag: string,
    schema: T,
    private excludeKeys?: K[],
    private onUpdate?: (args?: any) => void | Promise<void>,
  ) {
    this.key = `${KEYS[domain]}:${tag}`;
    this.validator = getSchemaValidator(schema);
  }

  private clear(value: Extract<Static<T>, Record<string, any>>) {
    // oxlint-disable-next-line typescript/consistent-type-assertions
    return (
      this.excludeKeys?.length
        ? Object.fromEntries(
            Object.entries(value).filter(
              // oxlint-disable-next-line typescript/consistent-type-assertions
              ([k]) => !this.excludeKeys?.includes(k as K),
            ),
          )
        : value
    ) as Omit<Static<T>, K>;
  }

  public async set(
    value: Extract<Static<T>, Record<string, any>>,
    expire = 60 * 30,
  ) {
    const readyValue = this.clear(value);

    await Bun.redis.setex(this.key, expire, JSON.stringify(readyValue));
    if (this.onUpdate) await this.onUpdate();

    console.log('Cache set for ', this.key);
    return readyValue;
  }

  public async del() {
    await Bun.redis.del(this.key);
    if (this.onUpdate) await this.onUpdate();
  }

  public async get() {
    const valueString = await Bun.redis.get(this.key);

    if (!valueString) return { error: 'Redis key is empty' };

    const { data, error } = this.validator.safeParse(JSON.parse(valueString));

    if (error || !data) return { error: '!safeParse: ' + error };

    return { value: this.clear(data) };
  }
}

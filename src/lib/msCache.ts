import { ICachePlugin, TokenCacheContext } from "@azure/msal-common";
import { prisma } from "./prisma";

const CacheConfigKey = "cacheConfig";

export class MsCachePlugin implements ICachePlugin {
  async afterCacheAccess(tokenCacheContext: TokenCacheContext): Promise<void> {
    if (!tokenCacheContext.cacheHasChanged) {
      return;
    }
    await prisma.config.upsert({
      where: {
        key: CacheConfigKey
      },
      update: {
        value: tokenCacheContext.cache.serialize()
      },
      create: {
        key: CacheConfigKey,
        value: tokenCacheContext.cache.serialize()
      }
    });
  }

  async beforeCacheAccess(tokenCacheContext: TokenCacheContext): Promise<void> {
    const data = await prisma.config.findUnique({
      where: {
        key: CacheConfigKey
      }
    });
    if (data) {
      tokenCacheContext.cache.deserialize(data.value);
    }
  }
}

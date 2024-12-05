import memoize from 'lodash/memoize'

export type PageMeta = {
  title: string
  description?: string
  image?: string
}

export const DEFAULT_META: PageMeta = {
  title: 'DexTop',
  description: 'Trade, earn, and own crypto on the all-in-one DexTop'
}

interface PathList {
  paths: { [path: string]: { title: string; basePath?: boolean; description?: string; image?: string } }
  defaultTitleSuffix: string
}

const getPathList = (): PathList => {
  return {
    paths: {
      '/': { title: 'Swap'},
      '/swap': { basePath: true, title: 'Swap'},
      '/add': { basePath: true, title: 'Add Pool'},
      '/remove': { basePath: true, title: 'Remove Pool'},
      '/pool': { title: 'Pool'},
      '/find': { title: 'Import Pool' },
      '/farms': { title: 'Farms'},
      '/pools': { title: 'Pools'},
      '/info': {
        title: "Overview - Info",
        description: 'View statistics for DexTop.'
      },
      '/info/pairs': {
        title: 'Pairs - Info',
        description: 'View statistics for DexTop.'
      },
      '/info/tokens': {
        title: "Tokens - Info",
        description: 'View statistics for DexTop.'
      }
    },
    defaultTitleSuffix: 'DexTop',
  }
}

export const getCustomMeta = memoize(
  (path: string): PageMeta | null => {
    const pathList = getPathList()
    const basePath = Object.entries(pathList.paths).find(([url, data]) => data.basePath && path.startsWith(url))?.[0]
    const pathMetadata = pathList.paths[path] ?? (basePath && pathList.paths[basePath])

    if (pathMetadata) {
      return {
        title: `${pathMetadata.title}`,
        ...(pathMetadata.description && { description: pathMetadata.description }),
        image: pathMetadata.image,
      }
    }
    return null
  },
  (path) => `${path}`,
)

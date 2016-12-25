# appcache-manifest-validate

AppCache manifest validator which fetches each resource that needs to be cached and shows the HTTP status code. Missing resources cause the cache update process to fail. In that case the browser keeps using the old cache.

# Usage

``` sh
$ appcache-manifest-validate http://www.somesite.com/manifest.appcache
```

# Installation

``` sh
$ npm install appcache-manifest-validate -g
```

# License

BSD
# safecli

A small command-line tool that prints `Hello world`.

## Install and run

Use a currently supported Node.js release (minimum compatible version: 20).

```sh
npm install --global github:theclifactory/safecli#v0.1.0
safecli
```

Output:

```text
Hello world
```

`safecli --help` shows usage. `safecli --version` shows the version.
Unsupported arguments return exit code 2 without printing those arguments.

There are no runtime dependencies, network requests, telemetry, credential
access, or shell subprocesses. The default command writes only its greeting;
`--version` reads the adjacent package metadata.

## Development

From a source checkout:

```sh
node bin/safecli.js
npm test
```

You can also install a local checkout with `npm install --global .`.
See [CONTRIBUTING.md](https://github.com/theclifactory/safecli/blob/main/CONTRIBUTING.md)
before committing or releasing.
The package is marked private to prevent accidental npm publication. It can
still be packed and installed locally. Registry publication requires a separate
review of the publisher account and namespace ownership.

## License

MIT.

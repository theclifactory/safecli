# safecli

A small command-line tool that prints `Hello world`.

## Run

Use a currently supported Node.js release (minimum compatible version: 20).

```sh
node bin/safecli.js
```

Output:

```text
Hello world
```

To install from a local checkout:

```sh
npm install --global .
safecli
```

`safecli --help` shows usage. `safecli --version` shows the version.
Unsupported arguments return exit code 2 without printing those arguments.

There are no runtime dependencies, network requests, telemetry, credential
access, or shell subprocesses. The default command writes only its greeting;
`--version` reads the adjacent package metadata.

## Development

```sh
npm test
```

See [CONTRIBUTING.md](CONTRIBUTING.md) before committing or releasing.
The package is marked private to prevent accidental npm publication. It can
still be packed and installed locally. Registry publication requires a separate
review of the publisher account and namespace ownership.

## License

MIT.

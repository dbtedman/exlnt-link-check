# [ExLNT Link Check](https://github.com/dbtedman/exlnt-link-check)

> This project is no longer maintained.

Tool used for populating [ExLNT](https://app.secure.griffith.edu.au/exlnt/) link check report with validation statuses.

## Getting Started

Download **Outbound Link Report** and rename it as `in.csv`.

Install Yarn dependencies.

```bash
yarn install
```

Run `link-check` command to generate report which will be saved to file `out.csv`.

```bash
yarn link-check --in in.csv --out out.csv
```

## Want to lean more?

-   See our [Contributing Guide](CONTRIBUTING.md) for details on how this repository is developed.
-   See our [Changelog](CHANGELOG.md) for details on which features, improvements, and bug fixes have been implemented
-   See our [License](LICENSE.md) for details on how you can use the code in this repository.
-   See our [Security Guide](SECURITY.md) for details on how security is considered.

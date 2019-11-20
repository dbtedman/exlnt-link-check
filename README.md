# [ExLNT Link Check](https://github.com/dbtedman/exlnt-link-check)

[![Known Vulnerabilities](https://snyk.io/test/github/dbtedman/exlnt-link-check/badge.svg?style=flat-square)](https://snyk.io/test/github/dbtedman/exlnt-link-check)
[![Maintainability](https://api.codeclimate.com/v1/badges/54f9304cff9c47f4303e/maintainability)](https://codeclimate.com/github/dbtedman/exlnt-link-check/maintainability)
[![GitHub Actions](https://github.com/dbtedman/exlnt-link-check/workflows/Test/badge.svg)](https://github.com/dbtedman/exlnt-link-check/actions?workflow=Test)

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

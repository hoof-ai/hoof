# Contributing to Rusty-Llama

We want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

We use github to host code, to track issues and feature requests, as well as accept pull requests.

_Please remember this is an open source project without financial backing, or dedicated developers._

## We Use [Github Flow](https://docs.github.com/en/get-started/quickstart/github-flow), All code changes happen through pull requests

Pull requests are the best way to propose changes to the codebase (we use [Github Flow](https://guides.github.com/introduction/flow/index.html)).

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests if applicable.
3. If you've changed APIs, update the documentation.
4. Make sure your code lints.
5. Ensure the test suite passes locally and on CI.
6. Issue that pull request!

No PR is too small! Spot a typo or missing documentation? Submit a PR!

## Any contributions you make will be under the MIT Software License

In short, when you submit code changes, your submissions are understood to be under the same [MIT License](http://choosealicense.com/licenses/mit/) that covers the project. Feel free to contact the maintainers if that's a concern.

## Report bugs using Github's [issues](https://github.com/ai-qol-things/rusty-ollama/issues)

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/ai-qol-things/rusty-ollama/issues/new/choose); it's that easy!

## Write bug reports with detail, background, and sample code

[This is an example](http://stackoverflow.com/q/12488905/180626) of a well written bug report, here is [another](http://www.openradar.me/11905408).

Great bug reports tend to have:

- A quick summary and/or background.
- Steps to reproduce.
  - Be specific!
  - Give sample code (if you can).
- What you expected would happen.
- What actually happens.
- Notes / screenshots / suggestions.

People love thorough bug reports - but be concise, don't write an essay.

## Use a Consistent Coding Style

I'm again borrowing these from [Facebook's Guidelines](https://github.com/facebook/draft-js/blob/a9316a723f9e918afde44dea68b5f9f39b7d9b00/CONTRIBUTING.md)

- 2 spaces for indentation rather than tabs
- You can lint manually by running:
  - `cargo fmt --manifest-path src-tauri/Cargo.toml --all -- --check`
  - `cargo clippy --manifest-path src-tauri/Cargo.toml --all-targets --`

## License

By contributing, you agree that your contributions will be licensed under its MIT License.

## References

This document was adapted from:

- [@briandk/CONTRIBUTING.md](https://gist.github.com/briandk/3d2e8b3ec8daf5a27a62)
- The open-source contribution guidelines for [Facebook's Draft](https://github.com/facebook/draft-js/blob/a9316a723f9e918afde44dea68b5f9f39b7d9b00/CONTRIBUTING.md)

Also see our [Code of Conduct](CODE_OF_CONDUCT.md)

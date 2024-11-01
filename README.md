# react-bootstrap-utils ![Node.js CI](https://github.com/assisrafael/react-bootstrap-utils/workflows/Node.js%20CI/badge.svg?branch=master)

A React implementation of Boostrap v5 components.

Original docs and demo: https://assisrafael.github.io/react-bootstrap-utils/


## How to to run

Building the library

```bash
npm run build
```

Starting demo app

```bash
npm run start
```

## How to Publish a New Version

Make sure the master branch is updated (git pull) and make sure all new commits (or expected commits) are included. 
Suggested log visualization:

```bash
git log --graph --pretty=format:'%C(yellow)%h%C(cyan)%d%Creset %s - %C(blue)%an%Creset, %C(white)%ar%Creset'
```

On the terminal, run the command, depending on major, minor or patch version:

```bash
npm run release-patch
```

```bash
npm run release-minor
```

```bash
npm run release-major
```

followed by:

```bash
git push --follow-tags origin master && npm publish
```

Check the repository on Github, verifying the newly created tag
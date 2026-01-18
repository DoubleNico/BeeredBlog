<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h1>BeeredBlog</h1>
  <p>
    Create and manage markdown blogs in a fun and easy way using <a href="https://nuxt.com/">Nuxt</a> and <a href="https://ui.nuxt.com/">Nuxt UI</a> and <a href="https://content.nuxt.com/">Nuxt Content</a>   <br />
    <br />
    <a href="https://github.com/DoubleNico/BeeredBlog/issues">Report Bug</a>
    ·
    <a href="https://github.com/DoubleNico/BeeredBlog/issues">Request Feature</a>
  </p>
</div>




<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#build">Build</a></li>
  </ol>
</details>




<!-- ABOUT THE PROJECT -->

## About The Project

! This project I made it for fun and should not be used in a production state because scaling would be a pain and there is not any auth made and rate limiting for the backend related fetches 
I am using Nuxt Content to store all the markdown files and using [Javalin](https://javalin.io/) with PostgresSQL for storing users, auth stuff and keeping track of the markdown files created
Checkout my [Backend](https://github.com/DoubleNico/BeeredBlog-Backend) for more information about it!

Check out the [roadmap](#roadmap) for what features will be coming next!
Check out [photos](https://photos.app.goo.gl/d4HJt8RBfvBPKz2L7) with the website(can't really host if for free sadly) !
![Photo showing landing page](https://lh3.googleusercontent.com/pw/AP1GczOV0b9QRWn72rNZ0mC7z6xKpfp95cNXTasne3nsHzmKYkTnElB3jMRlVIWJAqh1QEPS2HFQRP8Rgpcr7PvqPpUtxeK5UBnPugzskKjRpRQowZs_pfV1rjzveG7Od8Boz2XqwZsp1DKKAl6hrEUaL-K3=w2880-h1722-s-no-gm?authuser=0)

<!-- ROADMAP -->

## Roadmap

Contributions are what make the open-source community such an amazing place to learn, inspire, and create.  
Any contributions you make are **greatly appreciated**!  
If you're new to contributing to open-source projects,
you can follow [this](https://docs.github.com/en/get-started/quickstart/contributing-to-projects) guide to get
up-to-speed.

<!-- LICENSE -->

## License

Distributed under the MIT License
See [LICENSE][license-url] for more information.

## Build

### Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

### Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

### Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

[license-url]: https://github.com/DoubleNico/BeeredBlog/blob/master/LICENSE

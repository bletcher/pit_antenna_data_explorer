# Pit Antenna Data Explorer
Setup steps:
1) In the terminal, go to root directory (one below the subdirectory you will create in the next step)
2) Run `npm init "@observablehq"` and don't initialize git
3) In vsCode, open the folder for the project and then publish to a new repo (from the `source control` badge)
4) Go to Actions and hit `GitHub Pages Jekyll` to set up `jekyll-gh-pages.yml`
   [or, in settings, in Build and deployment, set source as github actions and configure GitHub Pages Jekyll]
5) In `jekyll-gh-pages.yml` add the bottom two lines as follows: 
   `  - name: Upload artifact  
        uses: actions/upload-pages-artifact@v3  
        with:  
          path: './dist'  
    `
    to make the  /dist the source for the github.io page. Commit this change in github.
5) In github on the settings/actions page, make sure `Github Actions` is selected in the source dropdopwn.  
6) Delete `./dist` from .gitignore.  
7) In the terminal, run `npm run build` to build the site in /dist.  
8) Run this in the terminal: `git lfs track "*.csv"` to track large data files.  
8) Do normal commit/push cycle.

<hr>  

This is an [Observable Framework](https://observablehq.com/framework) project. To start the local preview server, run:

```
npm run dev
```

Then visit <http://localhost:3000> to preview your project.

For more, see <https://observablehq.com/framework/getting-started>.

## Project structure

A typical Framework project looks like this:

```ini
.
├─ src
│  ├─ components
│  │  └─ timeline.js           # an importable module
│  ├─ data
│  │  ├─ launches.csv.js       # a data loader
│  │  └─ events.json           # a static data file
│  ├─ example-dashboard.md     # a page
│  ├─ example-report.md        # another page
│  └─ index.md                 # the home page
├─ .gitignore
├─ observablehq.config.js      # the project config file
├─ package.json
└─ README.md
```

**`src`** - This is the “source root” — where your source files live. Pages go here. Each page is a Markdown file. Observable Framework uses [file-based routing](https://observablehq.com/framework/routing), which means that the name of the file controls where the page is served. You can create as many pages as you like. Use folders to organize your pages.

**`src/index.md`** - This is the home page for your site. You can have as many additional pages as you’d like, but you should always have a home page, too.

**`src/data`** - You can put [data loaders](https://observablehq.com/framework/loaders) or static data files anywhere in your source root, but we recommend putting them here.

**`src/components`** - You can put shared [JavaScript modules](https://observablehq.com/framework/javascript/imports) anywhere in your source root, but we recommend putting them here. This helps you pull code out of Markdown files and into JavaScript modules, making it easier to reuse code across pages, write tests and run linters, and even share code with vanilla web applications.

**`observablehq.config.js`** - This is the [project configuration](https://observablehq.com/framework/config) file, such as the pages and sections in the sidebar navigation, and the project’s title.

## Command reference

| Command           | Description                                              |
| ----------------- | -------------------------------------------------------- |
| `npm install`            | Install or reinstall dependencies                        |
| `npm run dev`        | Start local preview server                               |
| `npm run build`      | Build your static site, generating `./dist`              |
| `npm run deploy`     | Deploy your project to Observable                        |
| `npm run clean`      | Clear the local data loader cache                        |
| `npm run observable` | Run commands like `observable help`                      |

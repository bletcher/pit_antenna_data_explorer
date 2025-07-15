// See https://observablehq.com/framework/config for documentation.
export default {
  // The project’s title; used in the sidebar and webpage titles.
  title: "PIT Tag Data Explorer",

  // The pages and sections in the sidebar. If you don’t specify this option,
  // all pages will be listed in alphabetical order. Listing pages explicitly
  // lets you organize them into sections and have unlisted pages.
   pages: [
     {
       name: "Chapters",
       pages: [
         {name: "Overview", path: "/overview"},
         {name: "Variables over time", path: "/overTime"},
         {name: "By individual", path: "rawDataByInd"},
         {name: "Individuals range plot", path: "individualsRangePlot"},
         {name: "Antenna data", path: "antennaData"},
         
         //{hr: true}
       ]
     },
     //{
      //name: "Early versions",
      //pages: [
        //{name: "Overview first version", path: "/overviewFirst"},
        //{name: "Overview - parquet sql", path: "/overviewParquet"},
      //]
    //}
   ],

  // Some additional configuration options and their defaults:
  // theme: "default", // try "light", "dark", "slate", etc.
  // header: "", // what to show in the header (HTML)
  // footer: "Built with Observable.", // what to show in the footer (HTML)
  // toc: true, // whether to show the table of contents
  // pager: true, // whether to show previous & next links in the footer
  root: "src", // path to the source root for preview
  output: "dist", // path to the output root for build
  search: true, // activate search
  cleanUrls: false // use URLs with .html
};

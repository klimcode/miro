const isDev = process.env.NODE_ENV !== "production";
console.log("Is Development? ", isDev);

module.exports = {
  classNameSlug: isDev ? "[title]-[hash]" : "[hash]"
};

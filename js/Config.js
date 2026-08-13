const res = await fetch("./config.json");
const data = await res.json();

const config = Object.freeze(data);

export default config;

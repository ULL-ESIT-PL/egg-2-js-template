let cs = Object.create(null);
cs["x"] = 4;
{
  let oldScope = cs;
  let localScope = Object.create(cs);
  cs = localScope;
  cs["x"] = 9;
  console.log(cs["x"]);
  cs = oldScope;
}
console.log(cs["x"]);

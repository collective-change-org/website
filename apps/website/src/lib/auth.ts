// async function verifyToken(token: string) {
//   const res = await fetch("http://localhost:3000/api/auth/verify", {
// 	method: "POST",
// 	headers: {
// 	  "Content-Type": "application/json",
// 	},
// 	body: JSON.stringify({
// 	  token,
// 	}),
//   }).catch((e) => {
// 	throw new Error(e);
//   });
//   if (res.status !== 200) {
// 	throw new Error("Invalid token");
//   }
//   return "";
// }
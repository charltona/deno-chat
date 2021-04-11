import { serve } from "http://deno.land/std@0.92.0/http/server.ts";
import { existsSync } from "https://deno.land/std/fs/mod.ts";
import { acceptWebSocket, acceptable } from "https://deno.land/std/ws/mod.ts";
import { chatConnection } from './src/chatroom.ts';

const s = serve({port: 8000});
console.log('🌍 serving on http://localhost:8000');

for await (const req of s) {
    try {
        let response = false;
        if (req.url === "/") {
            req.respond({
                status: 200,
                body: await Deno.open('./public/index.html')
            })
            response = true;
        }

        if (req.url === '/ws') {
            if (acceptable(req)) {
                acceptWebSocket({
                    conn: req.conn,
                    bufReader: req.r,
                    bufWriter: req.w,
                    headers: req.headers
                }).then(chatConnection)
                response = true;
            }
        }

        // Budget file loader.
        if (!response && existsSync(`.${req.url}`)) {
            req.respond({
                status: 200,
                body: await Deno.open(`.${req.url}`)
            })
            response = true
        }

        // Budget 404.
        if (!response && !existsSync(`.${req.url}`)) {
            req.respond({
                status: 404
            })
        }
    }
    catch (e) {
        console.log(`Error on req: ${req.url} `)
        req.respond({
            status: 404,
        })
    }



}

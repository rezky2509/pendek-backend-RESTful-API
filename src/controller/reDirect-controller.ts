import { Hono } from "hono";
import { UrlMapperService } from "../service/UrlMapperService";
import { URL_VALIDITY_STATUS } from "./models/urlMapper-model";

export const reDirectURLController = new Hono()

    reDirectURLController.get(':shortURL',async(c)=>{
        // fetch the url
        console.log('Reading user shorten url')
        const urlParam = await c.req.param()
        // console.log(urlParam.shortURL)
        const redirectURL = await UrlMapperService.reDirect(urlParam.shortURL) as URL_VALIDITY_STATUS

        // This header configuration to disable cache
        // Set headers to completely kill browser caching for this request
        c.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        // c.header('Pragma', 'no-cache');
        // c.header('Expires', '0');

        if(redirectURL.success === false && redirectURL.errorType === 'URL IS NOT ACTIVE') {
            const htmlNotFoundLink =`
            <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Link Inactive</title>
                    <script src="https://cdn.tailwindcss.com"></script>
                    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100;400;700;800&display=swap" rel="stylesheet">
                    <script>
                        tailwindConfig = {
                            theme: {
                                extend: {
                                    fontFamily: {
                                        sans: ['JetBrains Mono', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                                        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
                                    },
                                    colors: {
                                        background: '#ffffff',
                                        foreground: '#000000',
                                        primary: 'oklch(0.21 0.034 264.665)',
                                        'primary-foreground': 'oklch(0.985 0.002 247.839)',
                                        secondary: 'oklch(0.967 0.003 264.542)',
                                        'secondary-foreground': 'oklch(0.21 0.034 264.665)',
                                        muted: 'oklch(0.967 0.003 264.542)',
                                        'muted-foreground': 'oklch(0.551 0.027 264.364)',
                                        destructive: 'oklch(0.577 0.245 27.325)',
                                        border: 'oklch(0.928 0.006 264.531)',
                                    },
                                },
                            },
                        }
                    </script>
                    <style>
                        * {
                            box-sizing: border-box;
                            margin: 0;
                            padding: 0;
                            -webkit-font-smoothing: antialiased;
                        }

                        body {
                            background-color: #ffffff;
                            color: #000000;
                            font-family: 'JetBrains Mono', ui-sans-serif, system-ui, sans-serif;
                            font-size: 14px;
                            line-height: 1.5;
                            height: 100vh;
                            width: 100vw;
                            overflow: hidden;
                        }

                        .text-primary {
                            color: oklch(0.21 0.034 264.665);
                        }

                        .text-muted-foreground {
                            color: oklch(0.551 0.027 264.364);
                        }

                        .bg-primary {
                            background-color: oklch(0.21 0.034 264.665);
                        }

                        .text-primary-foreground {
                            color: oklch(0.985 0.002 247.839);
                        }

                        .border-black {
                            border-color: #000000;
                        }

                        .text-black {
                            color: #000000;
                        }

                        button, a.button {
                            cursor: pointer;
                            border-radius: 0.625rem;
                            padding: 8px 16px;
                            font-weight: 500;
                            transition: all 200ms;
                            border: none;
                            text-decoration: none;
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                            font-family: 'JetBrains Mono', ui-sans-serif, system-ui, sans-serif;
                        }

                        .btn-primary {
                            background-color: oklch(0.21 0.034 264.665);
                            color: oklch(0.985 0.002 247.839);
                        }

                        .btn-primary:hover {
                            opacity: 0.9;
                        }

                        .btn-secondary {
                            border: 2px solid oklch(0.928 0.006 264.531);
                            background-color: #ffffff;
                            color: #000000;
                        }

                        .btn-secondary:hover {
                            background-color: oklch(0.967 0.003 264.542);
                        }
                    </style>
                </head>
                <body>
                    <main class="flex items-center justify-center min-h-screen px-4">
                        <div class="max-w-md w-full text-center space-y-6">
                            <!-- Icon/Status Indicator -->
                            <div class="flex justify-center">
                                <div class="inline-flex items-center justify-center w-16 h-16 rounded-lg border border-black">
                                    <svg
                                        class="w-10 h-10 text-primary"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        ></path>
                                    </svg>
                                </div>
                            </div>

                            <!-- Heading -->
                            <div class="space-y-2">
                                <h1 class="text-3xl font-bold tracking-tight">Link Inactive</h1>
                                <p class="text-muted-foreground">
                                    This link is no longer active or has expired.
                                </p>
                            </div>

                            <!-- Description -->
                            <p class="text-sm text-muted-foreground leading-relaxed">
                                The link you're trying to access is no longer available. This could
                                be because it has expired, been removed, or is temporarily unavailable.
                            </p>
                        </div>
                    </main>
                </body>
                </html>
                `
            return c.html(htmlNotFoundLink,410)
        } 
        if(redirectURL.success === true) {
            if(redirectURL.shorten_url.includes('https://',0)){
                return c.redirect(redirectURL.shorten_url,301)
            }else{
                return c.redirect(`https://${redirectURL}`,301)
            }
        }
    })
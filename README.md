<div align="center">
    <img style="background: #fff; padding: 8px; border-radius: 32px;" src="./logo/clanker.svg">
</div>

## Have you ever wanted to only let bots through and not people?
### Enter CLANKER, the tool that lets only bots through.

CLANKER is a revolutionary tool that inverts the traditional captcha. Instead of proving you are human, you must prove they are a bot. This is achieved through a test that a bot is good at, but a human is not.

## Features

CLANKER includes a variety of challenges to test the user's "bot-ness":

*   **Cursor Precision**: Users must draw a perfectly straight line between two points on a canvas. The system analyzes the line for straightness and accuracy.
*   **Color Differentiation**: A grid of colored boxes is displayed, and the user must identify the one box that has a slightly different color. The color difference is often too subtle for the human eye to detect.
*   **Complex Calculations**: Users are presented with difficult math problems, such as solving integrals or finding large Fibonacci numbers, often with a strict time limit.
*   **Pattern Recognition**: Challenges that involve identifying patterns, like finding a unique element in a series or matching strings with regular expressions.

## Installation

To use CLANKER on your website, you can embed the widget using an iframe:

```html
<iframe src="path/to/clank/embed.html" width="320" height="80" style="border:none;"></iframe>
```

You will need to host the `clank` directory containing `embed.html`, `embed.js`, and the `logo` folder on your web server.
Or you could use the already hosted verison:

```html
<iframe src="https://mewinator.github.io/CLANKER/embed.html" width="320" height="80" style="border:none;"></iframe>
```

## Customization

You can customize the appearance of the widget to fit your website's theme.

*   **Light Theme**: To use a light theme, add `?theme=light` to the end of the `embed.html` URL in your iframe's `src` attribute.

    ```html
    <iframe src="path/to/clank/embed.html?theme=light" width="320" height="80" style="border:none;"></iframe>
    ```

## Oh btw, I'm not a bot. Just a penguin

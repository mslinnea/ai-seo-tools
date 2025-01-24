# WordPress Plugin: AI SEO Tools

This plugin provides a set of tools to help with automating SEO using Generative AI.  Tested with OpenAI, and should
be compatible with all AI services supported by the [AI Services Plugin](https://github.com/felixarntz/ai-services).

## Features

- Generate Meta Description
- Generate Meta Keywords
- Generate Image Alt Text via Image Block toolbar button
- Generate Image Alt Text in Media Library

# Demo with OpenAI gpt-3.5-turbo model

![CleanShot 2024-11-09 at 08 59 00](https://github.com/user-attachments/assets/1f137840-f8f2-42e9-be60-d32e0e011bcb)

# Media Library Integration

![CleanShot 2025-01-23 at 20 49 07@2x](https://github.com/user-attachments/assets/4bf1d73b-6fe9-4421-b078-3e8ae0a6a5d5)

# Requirements

- WordPress 6.6+
- PHP 8.2+

# Installation
- First Install and Activate the [AI Services Plugin](https://wordpress.org/plugins/ai-services/)
- Navigate to Settings => AI Services
- Configure an API key for at least one AI service.
- Install this plugin by downloading the zip from the `main-built` branch or the latest release.

# Development
- `nvm use` to ensure you are using the correct version of Node.js.
- `npm install` to install dependencies.
- `npm run build` to build the plugin.

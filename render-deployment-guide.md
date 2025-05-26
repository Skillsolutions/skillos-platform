# SkillOS Platform Deployment Guide for Render

This guide provides step-by-step instructions for deploying the SkillOS platform to Render via GitHub.

## Important Configuration Changes

The platform has been configured for server-side rendering (SSR) deployment on Render, which ensures all styles and components render correctly. The key configuration is in `next.config.js`, which has been updated to support SSR mode.

## Deployment Steps

### 1. Push to GitHub Repository

1. Create a new GitHub repository (or use an existing one)
2. Initialize git in the project directory (if not already done):
   ```bash
   cd /path/to/skillos-website
   git init
   ```
3. Add all files to git:
   ```bash
   git add .
   ```
4. Commit the files:
   ```bash
   git commit -m "Initial commit of SkillOS platform"
   ```
5. Add your GitHub repository as remote:
   ```bash
   git remote add origin https://github.com/yourusername/skillos-platform.git
   ```
6. Push to GitHub:
   ```bash
   git push -u origin main
   ```

### 2. Deploy to Render

1. Create a Render account at [render.com](https://render.com) if you don't have one
2. From your Render dashboard, click "New" and select "Web Service"
3. Connect your GitHub account and select the repository you created
4. Configure the web service with these settings:
   - **Name**: `skillos-platform` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Choose "Free" for testing or a paid plan for production

5. Under "Advanced" settings, add these environment variables:
   - `NODE_ENV`: `production`

6. Click "Create Web Service"

### 3. Troubleshooting Styling Issues

If you encounter any styling issues after deployment:

1. Verify that the build completed successfully in the Render logs
2. Check that the `next.config.js` file does NOT have `output: "export"` (this should be commented out)
3. Ensure all dependencies are installed correctly
4. Try clearing the Render cache by triggering a manual deploy:
   - Go to your web service in the Render dashboard
   - Click "Manual Deploy" and select "Clear build cache & deploy"

## Environment Variables

For production deployments, you may need to set additional environment variables in the Render dashboard:

```
NODE_ENV=production
NEXT_PUBLIC_API_URL=your_api_url_here
```

## Updating Your Deployment

Render will automatically deploy your application whenever you push changes to the main branch of your GitHub repository:

```bash
# Make changes to your code
git add .
git commit -m "Update feature XYZ"
git push origin main
```

## Custom Domain (Optional)

1. In the Render dashboard, go to your web service
2. Click on "Settings" and then "Custom Domain"
3. Follow the instructions to add and verify your domain

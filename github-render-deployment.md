# SkillOS Platform Deployment Guide

This guide provides instructions for deploying the SkillOS platform using GitHub and Render.

## Table of Contents
1. [GitHub Repository Setup](#github-repository-setup)
2. [Deploying to Render](#deploying-to-render)
3. [Environment Configuration](#environment-configuration)
4. [Updating Your Deployment](#updating-your-deployment)
5. [Troubleshooting](#troubleshooting)

## GitHub Repository Setup

### 1. Create a New GitHub Repository

1. Go to [GitHub](https://github.com) and sign in to your account
2. Click on the "+" icon in the top-right corner and select "New repository"
3. Name your repository (e.g., "skillos-platform")
4. Choose whether to make it public or private
5. Click "Create repository"

### 2. Initialize Your Local Repository

```bash
# Navigate to your project directory
cd /path/to/skillos-website

# Initialize git repository if not already done
git init

# Add all files to git
git add .

# Commit the files
git commit -m "Initial commit of SkillOS platform"

# Add the remote GitHub repository
git remote add origin https://github.com/yourusername/skillos-platform.git

# Push to GitHub
git push -u origin main
```

## Deploying to Render

### 1. Create a Render Account

1. Go to [Render](https://render.com/) and sign up for an account if you don't have one
2. Verify your email address

### 2. Connect Your GitHub Repository

1. Log in to your Render dashboard
2. Click on "New" and select "Web Service"
3. Connect your GitHub account if you haven't already
4. Select the repository you created for the SkillOS platform

### 3. Configure Your Web Service

1. Fill in the following details:
   - **Name**: `skillos-platform` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Choose "Free" for testing or a paid plan for production

2. Under "Advanced" settings, add the following environment variables:
   - `NODE_ENV`: `production`

3. Click "Create Web Service"

### 4. Wait for Deployment

Render will automatically build and deploy your application. This process may take a few minutes.

## Environment Configuration

### Environment Variables

For production deployments, you may need to set the following environment variables:

```
NODE_ENV=production
NEXT_PUBLIC_API_URL=your_api_url_here
```

You can set these in the Render dashboard under your web service's "Environment" tab.

### Custom Domain (Optional)

1. In the Render dashboard, go to your web service
2. Click on "Settings" and then "Custom Domain"
3. Follow the instructions to add and verify your domain

## Updating Your Deployment

### Automatic Deployments

By default, Render will automatically deploy your application whenever you push changes to the main branch of your GitHub repository.

```bash
# Make changes to your code
git add .
git commit -m "Update feature XYZ"
git push origin main
```

### Manual Deployments

You can also trigger manual deployments from the Render dashboard:

1. Go to your web service in the Render dashboard
2. Click on "Manual Deploy" and select "Deploy latest commit"

## Troubleshooting

### Build Failures

If your build fails, check the build logs in the Render dashboard for specific error messages. Common issues include:

- Missing dependencies in `package.json`
- TypeScript errors
- Environment variable configuration issues

### Runtime Errors

For runtime errors:

1. Check the logs in the Render dashboard
2. Ensure all required environment variables are set
3. Verify that your start command is correct

### Performance Issues

If your application is slow:

1. Consider upgrading from the free tier to a paid plan
2. Optimize your application code and assets
3. Implement caching strategies

---

For additional support, refer to the [Render documentation](https://render.com/docs) or contact your development team.

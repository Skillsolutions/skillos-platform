# Udemy Business xAPI Integration Guide for SkillOS

This guide explains how to configure Udemy Business to send real-time learning data to SkillOS using the xAPI (Experience API) integration.

## Prerequisites

- **Udemy Business Enterprise Plan**: Required for xAPI integration
- **SkillOS Platform**: Deployed and accessible at your domain (e.g., skillsolutions.io)
- **Admin Access**: To both Udemy Business and SkillOS platforms

## Step 1: Configure SkillOS xAPI Endpoints

SkillOS has already been configured with the following xAPI endpoints:

- **OAuth Token Endpoint**: `https://skillsolutions.io/api/xapi/oauth/token`
- **xAPI Statements Endpoint**: `https://skillsolutions.io/api/xapi/statements`

These endpoints are ready to receive and process xAPI statements from Udemy Business.

## Step 2: Configure Udemy Business xAPI Integration

Follow these steps in your Udemy Business admin panel:

1. **Log in to Udemy Business Admin**:
   - Go to your Udemy Business admin portal
   - Log in with your admin credentials

2. **Access Integration Settings**:
   - Navigate to **Settings** > **Integrations**
   - Select **xAPI Integration**

3. **Configure xAPI Settings**:
   - **Enable xAPI**: Toggle to "On"
   - **LRS Endpoint URL**: `https://skillsolutions.io/api/xapi/statements`
   - **OAuth Token URL**: `https://skillsolutions.io/api/xapi/oauth/token`
   - **Client ID**: Create a new client ID or use an existing one
   - **Client Secret**: Generate a new client secret or use an existing one

4. **Configure Event Types**:
   - Enable all event types for comprehensive tracking:
     - Course enrollments
     - Course completions
     - Course progress
     - Video interactions
     - Quiz attempts
     - Quiz completions

5. **Save Configuration**:
   - Click "Save" or "Apply" to activate the integration

## Step 3: Update SkillOS OAuth Configuration

After configuring Udemy Business, you need to update the SkillOS OAuth configuration with the client credentials:

1. **Add Client Credentials to SkillOS**:
   - Edit the file: `/src/app/api/xapi/oauth/token/route.ts`
   - Update the `VALID_CLIENTS` object with your Udemy Business client credentials:

```typescript
const VALID_CLIENTS: Record<string, string> = {
  "your_udemy_client_id": "your_udemy_client_secret"
};
```

2. **Deploy the Updated Configuration**:
   - Deploy the updated SkillOS platform with the new OAuth configuration

## Step 4: Test the Integration

To verify the integration is working correctly:

1. **Trigger Test Events in Udemy Business**:
   - Enroll in a course
   - Watch a video
   - Complete a course

2. **Check SkillOS xAPI Logs**:
   - Monitor the server logs for incoming xAPI statements
   - Verify that events are being received and processed

3. **View Real-Time Dashboard**:
   - Check the SkillOS dashboard to see real-time learning data
   - Verify that metrics are updating based on learning activities

## Troubleshooting

If you encounter issues with the integration:

1. **Check Connectivity**:
   - Ensure your SkillOS platform is accessible from the internet
   - Verify that the xAPI endpoints are responding correctly

2. **Validate OAuth Configuration**:
   - Confirm that the client credentials match between Udemy Business and SkillOS
   - Check for any OAuth authentication errors in the logs

3. **Monitor xAPI Statements**:
   - Review the format and content of incoming xAPI statements
   - Ensure they are being parsed and stored correctly

4. **Contact Support**:
   - Udemy Business Support: For issues with the Udemy Business configuration
   - SkillOS Support: For issues with the SkillOS xAPI implementation

## Next Steps

After successful integration:

1. **Customize Dashboards**: Tailor your SkillOS dashboards to highlight key learning metrics
2. **Set Up Alerts**: Configure alerts for important learning events
3. **Analyze Learning Data**: Use the real-time data to drive learning strategies

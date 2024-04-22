# qrev

## Getting Started

To get a local copy up and running, please follow these simple steps.

### Prerequisites

Here is what you need to be able to run QRev.

-   Node.js (Version: =18.18.0)
-   Mongo (Version: >=5.x)

    > If you want to enable any of the available integrations, you will have to obtain credentials for each one. More details on this can be found below under the [integrations section](#integrations).

### Setup

1. Clone the GitHub repo

    ```sh
    git clone https://github.com/qrev-ai/qrev.git
    ```

2. Go to the `server` folder

    ```sh
    cd server
    ```

3. Setup Node
   If your Node version does not meet the project's requirements as instructed by the docs, "nvm" (Node Version Manager) allows using Node at the version required by the project:

    ```sh
    nvm install v18.18.0
    ```

    ```sh
    nvm use 18.18.0
    ```

    > You can install nvm from [here](https://github.com/nvm-sh/nvm).

4. Install the packages with `npm`

    ```sh
    npm ci
    ```

    > `npm ci` makes sure that the versions of the packages installed will be from `package-lock.json`, this will make sure the right version of packages are installed.

5. Set up your `.env` file

    - Duplicate `.env.example` to `.env`
    - Use `openssl rand -base64 32` to generate a key and add this under `REFRESH_TOKEN_JWT_SECRET` in the `.env` file.
    - Use `openssl rand -base64 32` to generate a key and add this under `ACCESS_TOKEN_JWT_SECRET` in the `.env` file.
    - Use `openssl rand -base64 32` to generate a key and add this under `AI_BOT_SERVER_TOKEN` in the `.env` file and make sure the AI server uses the same token as well.

6. If you haven't already configured MongoDB and got the MONGO_DB_URL, then follow the steps [here](https://www.mongodb.com/docs/v3.0/tutorial/install-mongodb-on-ubuntu/) to install Mongo DB locally.

7. Run the below command to start the server:
    ```sh
    npm start
    ```

### Integrations

#### Creating Google Credentials for Signing in to QRev

1. Open [Google API Console](https://console.cloud.google.com/apis/dashboard). If you don't have a project in your Google Cloud subscription, you'll need to create one before proceeding further. Under Dashboard pane, select Enable APIS and Services.
2. Under Scopes, select the scope with scope value `https://www.googleapis.com/auth/gmail.send` and `https://www.googleapis.com/auth/gmail.readonly`.
3. In the third page (Test Users), add the Google account(s) you'll be using. Make sure the details are correct on the last page of the wizard and your consent screen will be configured.
4. Under `Credentials` section, create a `OAuth Client ID` credential with `Web Application` as the application type. Then add the following as the redirect URI: `<SERVER_URL_PATH>/api/google/auth/code/to/tokens`. If you are running on your local machine then `SERVER_URL_PATH` will be `http://localhost:8080`.
5. Now, copy the client ID and client secret and store it under `.env` as fields `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` respectively.

#### Zoom Integration

1. Open [Zoom Marketplace](https://marketplace.zoom.us/) and sign in with your Zoom account.
2. Under `Develop` build a `User-managed app` of `OAuth` type.
3. Make sure to de-select the option to publish the app on the Zoom App Marketplace.
4. Set the Redirect URL as `<SERVER_URL_PATH>/api/zoom/redirect` under `Production` (also add this URL under `OAuth Allow Lists`). If you are running on your local machine then `SERVER_URL_PATH` will be `http://localhost:8080`.
5. Now copy the Client ID and Client Secret for Production to your `.env` file as fields: `ZOOM_CLIENT_ID` and `ZOOM_CLIENT_SECRET`. Also, copy the Secret Token and Verification Token as fields: `ZOOM_SECRET_TOKEN` and `ZOOM_VERIFICATION_TOKEN`. These values will be useful to verify the event notifications sent by Zoom.

#### HubSpot Integration

1. Open [HubSpot Developer](https://developer.hubspot.com/) and sign into your account and then create a app.
2. Now copy the App ID, Client ID and Client Secret to your `.env` file as fields: `HUBSPOT_APP_ID`, `HUBSPOT_CLIENT_ID` and `HUBSPOT_CLIENT_SECRET`.
3. Set the Redirect URL for OAuth as `<SERVER_URL_PATH>/api/hubspot/redirect`.

#### Sendgrid Integration for Error Reporting (Optional)

> We currently use Sendgrid for error reporting whenever en error occurs in the backend server. So this is optional if you do not want to enable error reporting.

1. Create a SendGrid account (https://signup.sendgrid.com/)
2. Go to Settings -> API keys and create an API key.
3. Go to Settings -> Sender Authentication and verify a single sender.
4. Create a dynamic template with fields: `transaction_id`, `location`, `message`, `subject` and `message`.
5. Along with the API key, copy the dynamic template id that you just created into `.env` file as fields: `SENDGRID_API_KEY` and `SENDGRID_REPORT_ERROR_TEMPLATE_ID`. Also, set the `REPORT_FROM_EMAIL` field to the email that you verified in Step 3 in the `.env` file.
6. Add the two emails that you want to send the error messages as fields `PRIMARY_REPORT_EMAIL` and `SECONDARY_REPORT_EMAIL` in `.env` file.

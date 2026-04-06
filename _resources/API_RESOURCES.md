# API Resources

This folder contains implementation code for the Explainer, Email and Screenshot APIs.

## Packages to Install
- "nodemailer": "^6.10.1"
- "puppeteer-core": "^24.40.0"
- "@sparticuz/chromium": "^143.0.4"
- "@google/genai": "^1.46.0"
- "@octokit/graphql": "^8.2.2"

## Environment Variables
- GITHUB_TOKEN=with_this_variable,you_can_fetch_and_analyze_your_private_repos
- GEMINI_API_KEY=to_use_gemini_in_analyzer_endpoint
- NODE_ENV=used_in_screenshot_API_to_work_for_windows_chrome_on_local
- CHROME_EXECUTABLE_PATH=manual_chrome.exe_path_for_windows
- EMAIL_USER=gmail_user_email # you can use another nodemailer service other than gmail 
- EMAIL_PASS=gmail_user_password
- EMAIL_TO=reply_to_recipient

## API Documentation

### 1. Analyzer

> Request body and Response object
```json
POST /api/analyze
{
	"repos": ["owner/repo1", "owner/repo2"],
	"forceRefresh": false
}

{
	"results": [
		{
			"repo": "owner/repo1",
			"summary": "One-line project summary",
			"technologies": ["React", "TypeScript"]
		}
	]
}
```

### 2. Screenshot

```json
GET /api/screenshot
{
	"url": "https://website.com"
}
```

Response: Image file

Usage: `src={'/api/screenshot/'+${projectLink}}`

### 3. Send Email

```json
POST /api/send-email
{
	"fullName": "Jane Doe",
	"email": "jane@example.com",
	"message": "Hello",
}


{
  "message": "Email sent successfully"
}
```

Other Responses:
- `{ status: 500, error: 'Failed to send email' }`
- `{ status: 400, error: 'All fields are required' }`

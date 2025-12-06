# Security Policy for CogniFlow

## Our Commitment to Security

At the CogniFlow project, we consider the security of our browser library a top priority. Given its role in integrating with and extracting data from third-party AI platforms within a user's browser, we are deeply committed to protecting our users from potential vulnerabilities. We appreciate the invaluable contributions of security researchers and the community in helping us maintain a high standard of security.

This document outlines our security policy, including the process for reporting vulnerabilities and the best practices we follow.

## Supported Versions

Security updates are only applied to the most recent major release. We strongly encourage all users to stay on the latest version of `CogniFlow` to benefit from the latest features and security patches.

| Version | Supported          |
| ------- | ------------------ |
| `1.x.x` | :white_check_mark: |
| `< 1.0` | :x:                |

## Reporting a Vulnerability

We take all security reports seriously. If you believe you have discovered a security vulnerability in CogniFlow, we ask that you report it to us privately to protect our users.

**Please do not report security vulnerabilities through public GitHub issues.**

### Private Reporting via GitHub

The preferred method for reporting vulnerabilities is through **GitHub's private vulnerability reporting feature**. This ensures the information is delivered directly to the maintainers securely.

1.  Navigate to the main page of the repository: [https://github.com/chirag127/CogniFlow-AI-Platform-Integrator-And-Data-Extractor-Browser-Library](https://github.com/chirag127/CogniFlow-AI-Platform-Integrator-And-Data-Extractor-Browser-Library)
2.  Go to the "Security" tab.
3.  Click "Report a vulnerability" to open the advisory form.

### What to Include in Your Report

To help us triage and resolve the issue quickly, please include the following in your report:

*   **A clear and descriptive title.**
*   **A detailed description of the vulnerability**, including the potential impact.
*   **Step-by-step instructions** to reproduce the issue, including any proof-of-concept (PoC) code.
*   **The version(s) of the library affected.**
*   **Any potential mitigations or workarounds.**

### Our Response Process

Once we receive a security report, we commit to the following:

1.  **Acknowledgment:** We will acknowledge receipt of your report within **48 hours**.
2.  **Triage & Investigation:** We will investigate the report to confirm the vulnerability and determine its severity.
3.  **Communication:** We will maintain an open line of communication, providing updates on our progress at least once every **5 business days**.
4.  **Resolution:** We will work to release a patch as quickly as possible. The timeline will depend on the complexity of the vulnerability.
5.  **Public Disclosure:** After a fix is released, we will publish a security advisory on GitHub, crediting you for your discovery (unless you prefer to remain anonymous).

## Security Best Practices

CogniFlow is designed with security in mind. Key architectural considerations include:

*   **Secure `postMessage` Communication:** We strictly validate the `origin` of incoming messages to prevent Cross-Site Scripting (XSS) and unauthorized data access between the host page and the embedded AI platform iframes.
*   **DOM Interaction:** The use of `MutationObserver` is carefully scoped to minimize performance impact and prevent manipulation of sensitive DOM elements outside the target AI response areas. All extracted data should be treated as untrusted and sanitized by the consuming application if rendered.
*   **Dependency Management:** We use `Dependabot` to automatically monitor our dependencies for known vulnerabilities and ensure they are updated promptly. We encourage developers using this library to do the same in their projects.
*   **No Data Exfiltration:** The library operates entirely on the client-side. It does not collect, store, or transmit any user data or scraped content to any external servers maintained by the CogniFlow project.

Thank you for helping keep CogniFlow and its users safe.

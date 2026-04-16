# 🛠️ Help Desk Support System

A production-ready Help Desk Support system built to demonstrate **CI/CD pipelines**, **containerization**, **microservices architecture**, and **cloud deployment**.

**Target Audience:** University Staff (1000-2000 users)

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Docker](https://img.shields.io/badge/docker-ready-blue)
![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-green)
![AWS](https://img.shields.io/badge/deployed-AWS%20EC2-orange)

---

## 🚀 Features

- ✅ User ticket creation & tracking
- ✅ Admin/Support staff ticket management
- 🤖 AI-based ticket classification & suggestions
- 📧 Email notifications for ticket updates
- 🔄 Event-driven communication between services

---

## 🧱 Architecture

This project follows a **microservices architecture** where each service is independently developed and deployed.

### Services:

| Service         | Responsibility                                          |
|----------------|---------------------------------------------------------|
| **User Service**  | Handles authentication and user management            |
| **Ticket Service**| Manages ticket creation and status tracking           |
| **AI Service**    | Provides classification and solution suggestions      |
| **Email Service** | Sends notifications to users                          |

---

## ⚙️ Tech Stack

| Category           | Technology                                      |
|--------------------|-------------------------------------------------|
| **Frontend**       | React                                           |
| **Backend**        | Node.js (Express)                               |
| **Containerization**| Docker, Docker Compose                         |
| **CI/CD**          | GitHub Actions                                  |
| **Web Server**     | Nginx                                           |
| **Cloud Deployment**| AWS EC2                                         |
| **Messaging**      | Redis                                           |

---

## 🔁 CI/CD Pipeline

1. Code pushed to GitHub repository
2. GitHub Actions workflow triggers
3. Docker images are built for each service
4. Images are pushed to Docker Hub
5. EC2 server pulls latest images
6. Docker Compose runs updated containers

---

## 🐳 Docker Setup

### Run locally:
```bash
docker-compose up --build
```

---

## 📁 Project Structure

---

## 👩‍💻 Author

**Kanza Fatima**


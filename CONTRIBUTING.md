# Contributing to Abandoned Cart Service

Thank you for your interest in contributing! This is a great project for learning full-stack development.

## How to Contribute

### 1. Fork the Repository
```bash
git clone https://github.com/YOUR_USERNAME/abandoned-cart-service.git
cd abandoned-cart-service
```

### 2. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 3. Make Your Changes

#### Guidelines:
- Follow the existing code style
- Add TypeScript types for new code
- Test your changes locally
- Update documentation if needed

### 4. Commit Your Changes
```bash
git commit -m "feat: add your feature description"
```

### 5. Push to Your Fork
```bash
git push origin feature/your-feature-name
```

### 6. Create a Pull Request
- Describe your changes clearly
- Reference any related issues
- Include screenshots if UI changes

---

## Areas for Contribution

### High Priority 🔴
- [ ] Add SMS notifications (Twilio)
- [ ] Add WhatsApp notifications (Twilio)
- [ ] Implement payment processing (Stripe)
- [ ] Add admin dashboard
- [ ] Write unit tests

### Medium Priority 🟡
- [ ] Add Redis caching
- [ ] Implement rate limiting
- [ ] Add analytics dashboard
- [ ] Multi-language support
- [ ] Dark mode UI

### Low Priority 🟢
- [ ] Add more email templates
- [ ] Improve UI/UX
- [ ] Add animations
- [ ] SEO optimization
- [ ] Performance improvements

---

## Development Setup

```bash
# Backend
cd backend
npm install
cp .env.example .env
npm run dev

# Frontend (in another terminal)
cd frontend
npm install
npm run dev
```

---

## Coding Standards

### Frontend (React + TypeScript)
```typescript
// Use functional components
export const MyComponent: React.FC<Props> = ({ prop1, prop2 }) => {
  return <div>{prop1}</div>;
};

// Type your props
interface Props {
  prop1: string;
  prop2: number;
}
```

### Backend (Node.js + Express)
```typescript
// Use async/await
router.post('/', async (req: Request, res: Response) => {
  try {
    // Your code here
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error' });
  }
});
```

---

## Commit Message Convention

```
feat: add new feature
fix: fix a bug
docs: update documentation
style: format code
refactor: refactor code
perf: improve performance
test: add tests
chore: update dependencies
```

---

## Testing

### Frontend
```bash
cd frontend
npm run test
```

### Backend
```bash
cd backend
npm run test
```

---

## Pull Request Process

1. Update README if needed
2. Update documentation
3. Add tests for new features
4. Ensure all tests pass
5. Request review from maintainers

---

## Bug Reports

Create an issue with:
- Clear title
- Description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots/logs if helpful

---

## Feature Requests

Create an issue with:
- Clear title
- Feature description
- Use case/motivation
- Proposed solution
- Additional context

---

## Questions?

- Check the [README.md](./README.md)
- Check the [SETUP_GUIDE.md](./docs/SETUP_GUIDE.md)
- Open an issue with [question] tag

---

## Code Review Checklist

- [ ] Code follows project style
- [ ] All tests pass
- [ ] No console errors
- [ ] TypeScript types added
- [ ] Documentation updated
- [ ] No hardcoded values
- [ ] Error handling implemented

---

## Useful Commands

```bash
# Frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Backend
npm run dev          # Start dev server
npm run build        # Build TypeScript
npm start            # Start production server
npm run test         # Run tests
```

---

## Project Structure

```
abandoned-cart-service/
├── frontend/         # React app
├── backend/          # Express server
├── docs/             # Documentation
└── README.md
```

---

## Resources for Contributors

- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## License

This project is licensed under the MIT License - feel free to use it for your portfolio.

---

**Thank you for contributing! Every contribution helps make this project better! 🙌**

# Contributing to MIA Logistics Manager

🎉 Thank you for your interest in contributing to MIA Logistics Manager!

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Style Guidelines](#style-guidelines)
- [Testing](#testing)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## Getting Started

1. **Fork the repository**
2. **Clone your fork**

   ```bash
   git clone https://github.com/your-username/mia-logistics-manager.git
   cd mia-logistics-manager
   ```

3. **Run the development setup**

   ```bash
   ./setup-dev.sh
   ```

## Development Setup

### Prerequisites

- Node.js 16+
- npm 8+
- Google Cloud Platform account
- Git

### Setup Steps

1. Install dependencies: `npm install`
2. Copy environment file: `cp .env.example .env`
3. Configure Google Cloud credentials in `.env`
4. Start development server: `npm start`

## Contributing Guidelines

### Types of Contributions

We welcome several types of contributions:

- 🐛 **Bug fixes**
- ✨ **New features**
- 📚 **Documentation improvements**
- 🎨 **UI/UX enhancements**
- 🌐 **Translations**
- ⚡ **Performance improvements**
- 🧪 **Tests**

### Before You Start

1. **Check existing issues** to avoid duplicating work
2. **Create an issue** for major changes to discuss the approach
3. **Follow the coding standards** outlined below

## Pull Request Process

1. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clear, concise code
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**

   ```bash
   npm test
   npm run lint
   npm run build
   ```

4. **Commit your changes**

   ```bash
   git commit -m "feat: add amazing new feature"
   ```

   Use conventional commit format:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation
   - `style:` for formatting
   - `refactor:` for code refactoring
   - `test:` for tests
   - `chore:` for maintenance

5. **Push to your fork**

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Use a clear title and description
   - Reference any related issues
   - Include screenshots for UI changes

## Issue Reporting

### Bug Reports

Include the following information:

- **Description**: Clear description of the bug
- **Steps to reproduce**: Detailed steps
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Environment**: OS, browser, Node.js version
- **Screenshots**: If applicable

### Feature Requests

Include:

- **Problem description**: What problem does this solve?
- **Proposed solution**: Your suggested approach
- **Alternatives**: Other solutions you considered
- **Additional context**: Screenshots, mockups, etc.

## Style Guidelines

### JavaScript/React

- Use **ES6+ features**
- Follow **React Hooks** patterns
- Use **functional components**
- Implement **proper error boundaries**
- Follow **Material-UI** design patterns

### Code Style

```javascript
// Good
const TransportCard = ({ transport, onUpdate }) => {
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await onUpdate(transport.id);
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">
          {transport.id}
        </Typography>
      </CardContent>
    </Card>
  );
};
```

### CSS/Styling

- Use **Material-UI's sx prop** for styling
- Follow **responsive design** principles
- Use **theme colors** and spacing
- Avoid **inline styles** when possible

### File Naming

- Use **camelCase** for files: `TransportCard.js`
- Use **kebab-case** for directories: `transport-management`
- Use **UPPERCASE** for constants: `API_ENDPOINTS.js`

## Testing

### Writing Tests

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import TransportCard from './TransportCard';

describe('TransportCard', () => {
  const mockTransport = {
    id: 'TR-001',
    status: 'pending',
    origin: 'Hanoi',
    destination: 'Ho Chi Minh',
  };

  test('renders transport information', () => {
    render(<TransportCard transport={mockTransport} />);

    expect(screen.getByText('TR-001')).toBeInTheDocument();
    expect(screen.getByText('pending')).toBeInTheDocument();
  });

  test('handles update action', () => {
    const mockUpdate = jest.fn();
    render(
      <TransportCard
        transport={mockTransport}
        onUpdate={mockUpdate}
      />
    );

    fireEvent.click(screen.getByText('Update'));
    expect(mockUpdate).toHaveBeenCalledWith('TR-001');
  });
});
```

### Test Coverage

- Aim for **80%+ test coverage**
- Test **critical user journeys**
- Include **error scenarios**
- Test **accessibility features**

## Vietnamese Localization

When adding new features:

1. **Add translation keys** to `src/locales/vi.json` and `src/locales/en.json`
2. **Use Vietnamese-first approach** in UI design
3. **Consider Vietnamese business practices**
4. **Test with Vietnamese data formats** (dates, currency, addresses)

### Translation Example

```json
// vi.json
{
  "transport": {
    "create": "Tạo đơn vận chuyển",
    "status": {
      "pending": "Chờ xử lý",
      "confirmed": "Đã xác nhận"
    }
  }
}

// en.json
{
  "transport": {
    "create": "Create Transport",
    "status": {
      "pending": "Pending",
      "confirmed": "Confirmed"
    }
  }
}
```

## Google Services Integration

When working with Google APIs:

1. **Follow rate limiting** best practices
2. **Handle errors gracefully**
3. **Cache responses** when appropriate
4. **Test with real Google services**
5. **Document API usage** in code comments

## Documentation

- Update **README.md** for setup changes
- Add **JSDoc comments** for functions
- Include **examples** in documentation
- Update **API documentation** for new endpoints

## Questions?

- 💬 **GitHub Discussions**: For general questions
- 🐛 **GitHub Issues**: For bugs and feature requests
- 📧 **Email**: <dev@mialogistics.com>
- 📞 **Discord**: MIA Logistics Community

## Recognition

Contributors will be recognized in:

- **README.md** contributors section
- **Release notes** for significant contributions
- **Annual contributor appreciation** post

Thank you for contributing to MIA Logistics Manager! 🚚✨

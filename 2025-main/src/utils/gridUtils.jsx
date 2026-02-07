/**
 * Hệ thống quản lý nhân sự kho vận - Mã nguồn hoàn chỉnh
 *
 * Phiên bản: 1.0
 * Ngày: 18/05/2025
 */

// ---------------------------------
// CÁC HÀM HELPER CHO DOM MANIPULATION
// ---------------------------------

/**
 * Tạo element DOM với các thuộc tính và phần tử con
 * @param {string} type - Loại phần tử HTML
 * @param {object} props - Các thuộc tính của phần tử
 * @param {...Node} children - Các phần tử con
 * @returns {HTMLElement} Element đã tạo
 */
function createElement(type, props = {}, ...children) {
  const element = document.createElement(type);

  // Thiết lập các thuộc tính
  Object.entries(props).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(element.style, value);
    } else if (key.startsWith('on') && typeof value === 'function') {
      const eventType = key.substring(2).toLowerCase();
      element.addEventListener(eventType, value);
    } else if (key === 'innerHTML') {
      element.innerHTML = value;
    } else {
      element.setAttribute(key, value);
    }
  });

  // Thêm các phần tử con
  children.forEach(child => {
    if (child === null || child === undefined) return;

    if (typeof child === 'string' || typeof child === 'number') {
      element.appendChild(document.createTextNode(child));
    } else if (Array.isArray(child)) {
      child.forEach(nestedChild => {
        if (nestedChild instanceof Node) {
          element.appendChild(nestedChild);
        } else if (typeof nestedChild === 'string' || typeof nestedChild === 'number') {
          element.appendChild(document.createTextNode(nestedChild));
        }
      });
    } else if (child instanceof Node) {
      element.appendChild(child);
    }
  });

  return element;
}

/**
 * Tạo SVG element với các thuộc tính
 * @param {string} type - Loại phần tử SVG
 * @param {object} props - Các thuộc tính của phần tử
 * @returns {SVGElement} SVG Element đã tạo
 */
function createSvgElement(type, props = {}) {
  const element = document.createElementNS('http://www.w3.org/2000/svg', type);

  Object.entries(props).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });

  return element;
}

// ---------------------------------
// COMPONENT UI CƠ BẢN
// ---------------------------------

/**
 * Component Card
 * @param {object} options - Cấu hình card
 * @returns {HTMLElement} Card element
 */
function Card(options = {}) {
  const { title, content, className = '', footer, description } = options;
  const darkMode = getDarkModeStatus(); // Hàm kiểm tra trạng thái darkMode

  const cardClass = darkMode
    ? 'bg-gray-800 border-gray-700 text-gray-200'
    : 'bg-white border-gray-200 text-gray-700';

  const card = createElement('div', {
    className: `card rounded-xl shadow-sm ${cardClass} ${className} border p-4`
  });

  if (title) {
    const header = createElement('div', {
      className: 'card-header mb-4'
    });

    const titleElement = createElement('h3', {
      className: 'card-title text-lg font-semibold'
    }, title);

    header.appendChild(titleElement);

    if (description) {
      const descElement = createElement('div', {
        className: 'card-description text-sm mt-1 text-gray-500 dark:text-gray-400'
      }, description);
      header.appendChild(descElement);
    }

    card.appendChild(header);
  }

  if (content) {
    const contentContainer = createElement('div', {
      className: 'card-content'
    });

    if (typeof content === 'string') {
      contentContainer.innerHTML = content;
    } else if (content instanceof Node) {
      contentContainer.appendChild(content);
    } else if (typeof content === 'function') {
      contentContainer.appendChild(content());
    }

    card.appendChild(contentContainer);
  }

  if (footer) {
    const footerContainer = createElement('div', {
      className: 'card-footer mt-4 pt-3 border-t border-gray-200 dark:border-gray-700'
    });

    if (typeof footer === 'string') {
      footerContainer.innerHTML = footer;
    } else if (footer instanceof Node) {
      footerContainer.appendChild(footer);
    } else if (typeof footer === 'function') {
      footerContainer.appendChild(footer());
    }

    card.appendChild(footerContainer);
  }

  return card;
}

/**
 * Component Button
 * @param {object} options - Cấu hình button
 * @returns {HTMLElement} Button element
 */
function Button(options = {}) {
  const {
    text,
    icon,
    onClick,
    variant = 'default',
    size = 'md',
    className = '',
    disabled = false,
    type = 'button'
  } = options;

  const darkMode = getDarkModeStatus();

  // Định nghĩa các styles cho các variants
  const variantClasses = {
    default: darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800',
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-amber-500 hover:bg-amber-600 text-white',
    outline: darkMode ? 'border border-gray-600 hover:bg-gray-700 text-gray-300' : 'border border-gray-300 hover:bg-gray-100 text-gray-800',
    ghost: darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-800',
  };

  // Định nghĩa các styles cho các sizes
  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  const button = createElement('button', {
    className: `rounded-md transition-colors duration-200 flex items-center justify-center font-medium ${variantClasses[variant] || variantClasses.default} ${sizeClasses[size] || sizeClasses.md} ${className}`,
    type,
    disabled,
    onClick
  });

  if (icon) {
    const iconElement = createElement('span', {
      className: text ? 'mr-2' : '',
      innerHTML: icon
    });
    button.appendChild(iconElement);
  }

  if (text) {
    button.appendChild(document.createTextNode(text));
  }

  return button;
}

/**
 * Component Badge
 * @param {object} options - Cấu hình badge
 * @returns {HTMLElement} Badge element
 */
function Badge(options = {}) {
  const { text, variant = 'default', className = '' } = options;
  const darkMode = getDarkModeStatus();

  // Định nghĩa các styles cho các variants
  const variantClasses = {
    default: darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800',
    primary: darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800',
    success: darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800',
    danger: darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-800',
    warning: darkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-100 text-amber-800',
    secondary: darkMode ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-100 text-purple-800',
    outline: darkMode ? 'border border-gray-600 text-gray-300' : 'border border-gray-300 text-gray-800',
  };

  const badge = createElement('span', {
    className: `inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${variantClasses[variant] || variantClasses.default} ${className}`
  }, text);

  return badge;
}

/**
 * Component Progress Bar
 * @param {object} options - Cấu hình progress bar
 * @returns {HTMLElement} Progress bar element
 */
function Progress(options = {}) {
  const { value = 0, className = '', height = 'h-2' } = options;
  const darkMode = getDarkModeStatus();

  const progressContainer = createElement('div', {
    className: `w-full ${height} bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${className}`
  });

  const progressBar = createElement('div', {
    className: `h-full bg-blue-600 transition-all duration-300`,
    style: { width: `${value}%` }
  });

  progressContainer.appendChild(progressBar);

  return progressContainer;
}

/**
 * Component Input
 * @param {object} options - Cấu hình input
 * @returns {HTMLElement} Input element
 */
function Input(options = {}) {
  const {
    type = 'text',
    placeholder = '',
    value = '',
    onChange,
    className = '',
    id,
    min,
    max,
    step,
    disabled = false,
    label
  } = options;

  const darkMode = getDarkModeStatus();
  const inputBgClass = darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-800';

  const container = createElement('div', {
    className: 'input-container'
  });

  if (label) {
    const labelElement = createElement('label', {
      className: 'block text-sm font-medium mb-1 dark:text-gray-300',
      htmlFor: id
    }, label);
    container.appendChild(labelElement);
  }

  const input = createElement('input', {
    type,
    className: `w-full px-3 py-2 rounded-md border ${inputBgClass} focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`,
    placeholder,
    value,
    id,
    min,
    max,
    step,
    disabled
  });

  if (onChange) {
    input.addEventListener('input', e => onChange(e));
  }

  container.appendChild(input);

  return container;
}

/**
 * Component Switch (Toggle)
 * @param {object} options - Cấu hình switch
 * @returns {HTMLElement} Switch element
 */
function Switch(options = {}) {
  const {
    checked = false,
    onChange,
    className = '',
    id,
    label
  } = options;

  const darkMode = getDarkModeStatus();

  const container = createElement('div', {
    className: 'switch-container flex items-center'
  });

  const switchTrack = createElement('div', {
    className: `relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${checked ? 'bg-blue-600' : darkMode ? 'bg-gray-600' : 'bg-gray-200'} ${className}`
  });

  const switchThumb = createElement('span', {
    className: `pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`
  });

  switchTrack.appendChild(switchThumb);

  const hiddenInput = createElement('input', {
    type: 'checkbox',
    className: 'sr-only',
    checked,
    id
  });

  if (onChange) {
    switchTrack.addEventListener('click', e => {
      onChange(!checked);
    });
  }

  container.appendChild(switchTrack);
  container.appendChild(hiddenInput);

  if (label) {
    const labelElement = createElement('label', {
      className: 'ml-2 text-sm dark:text-gray-300',
      htmlFor: id
    }, label);
    container.appendChild(labelElement);
  }

  return container;
}

/**
 * Component TabNavigation
 * @param {object} options - Cấu hình tabs
 * @returns {HTMLElement} Tabs element
 */
function TabNavigation(options = {}) {
  const {
    tabs = [],
    activeTab = '',
    onTabChange,
    className = ''
  } = options;

  const darkMode = getDarkModeStatus();
  const highlightClass = darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-700';

  const container = createElement('div', {
    className: `tabs-container ${className}`
  });

  const tabsList = createElement('div', {
    className: 'tabs-list flex overflow-x-auto no-scrollbar border-b dark:border-gray-700 w-full justify-start mb-4'
  });

  tabs.forEach(tab => {
    const tabButton = createElement('button', {
      className: `tab-button flex items-center px-4 py-2 text-sm font-medium ${tab.value === activeTab ? highlightClass : ''}`,
      onClick: () => {
        if (onTabChange) {
          onTabChange(tab.value);
        }
      }
    });

    if (tab.icon) {
      const iconElement = createElement('span', {
        className: 'mr-2',
        innerHTML: tab.icon
      });
      tabButton.appendChild(iconElement);
    }

    tabButton.appendChild(document.createTextNode(tab.label));
    tabsList.appendChild(tabButton);
  });

  container.appendChild(tabsList);

  return container;
}

/**
 * Component Alert
 * @param {object} options - Cấu hình alert
 * @returns {HTMLElement} Alert element
 */
function Alert(options = {}) {
  const {
    title,
    description,
    variant = 'default',
    className = '',
    icon
  } = options;

  const darkMode = getDarkModeStatus();

  // Định nghĩa các styles cho các variants
  const variantClasses = {
    default: darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200',
    primary: darkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200',
    success: darkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200',
    danger: darkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200',
    warning: darkMode ? 'bg-amber-900/20 border-amber-800' : 'bg-amber-50 border-amber-200',
  };

  const textClasses = {
    default: darkMode ? 'text-gray-300' : 'text-gray-800',
    primary: darkMode ? 'text-blue-300' : 'text-blue-800',
    success: darkMode ? 'text-green-300' : 'text-green-800',
    danger: darkMode ? 'text-red-300' : 'text-red-800',
    warning: darkMode ? 'text-amber-300' : 'text-amber-800',
  };

  const alert = createElement('div', {
    className: `alert flex p-4 border rounded-lg ${variantClasses[variant] || variantClasses.default} ${className}`
  });

  const contentContainer = createElement('div', {
    className: 'flex-grow'
  });

  if (icon) {
    const iconElement = createElement('div', {
      className: `mr-3 ${textClasses[variant] || textClasses.default}`,
      innerHTML: icon
    });
    alert.appendChild(iconElement);
  }

  if (title) {
    const titleElement = createElement('h4', {
      className: `font-medium ${textClasses[variant] || textClasses.default}`
    }, title);
    contentContainer.appendChild(titleElement);
  }

  if (description) {
    const descElement = createElement('div', {
      className: `${title ? 'mt-1' : ''} text-sm ${textClasses[variant] || textClasses.default}`
    }, description);
    contentContainer.appendChild(descElement);
  }

  alert.appendChild(contentContainer);

  return alert;
}

/**
 * Component Dialog (Modal)
 * @param {object} options - Cấu hình dialog
 * @returns {object} Dialog controller
 */
function Dialog(options = {}) {
  const {
    title,
    content,
    footer,
    onClose,
    maxWidth = 'max-w-md'
  } = options;

  const darkMode = getDarkModeStatus();
  const bgClass = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white';

  // Tạo overlay
  const overlay = createElement('div', {
    className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity opacity-0'
  });

  // Tạo dialog container
  const dialogContainer = createElement('div', {
    className: `dialog-container ${maxWidth} w-full rounded-lg shadow-xl ${bgClass} p-4 transform transition-transform scale-95 opacity-0`
  });

  // Tạo dialog header nếu có title
  if (title) {
    const header = createElement('div', {
      className: 'dialog-header mb-4 pb-2 border-b dark:border-gray-700'
    });

    const titleElement = createElement('h3', {
      className: 'text-lg font-medium dark:text-white'
    }, title);

    header.appendChild(titleElement);
    dialogContainer.appendChild(header);
  }

  // Thêm nội dung
  if (content) {
    const contentContainer = createElement('div', {
      className: 'dialog-content'
    });

    if (typeof content === 'string') {
      contentContainer.innerHTML = content;
    } else if (content instanceof Node) {
      contentContainer.appendChild(content);
    } else if (typeof content === 'function') {
      contentContainer.appendChild(content());
    }

    dialogContainer.appendChild(contentContainer);
  }

  // Thêm footer nếu có
  if (footer) {
    const footerContainer = createElement('div', {
      className: 'dialog-footer mt-4 pt-2 border-t dark:border-gray-700 flex justify-end gap-2'
    });

    if (typeof footer === 'string') {
      footerContainer.innerHTML = footer;
    } else if (footer instanceof Node) {
      footerContainer.appendChild(footer);
    } else if (typeof footer === 'function') {
      footerContainer.appendChild(footer());
    }

    dialogContainer.appendChild(footerContainer);
  }

  // Thêm vào DOM ẩn
  overlay.appendChild(dialogContainer);
  document.body.appendChild(overlay);

  // Handler đóng dialog khi click vào overlay
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeDialog();
    }
  });

  // Handler đóng dialog khi nhấn ESC
  const escHandler = (e) => {
    if (e.key === 'Escape') {
      closeDialog();
    }
  };

  // Chức năng đóng dialog
  function closeDialog() {
    // Animation khi đóng
    dialogContainer.style.transform = 'scale(95%)';
    dialogContainer.style.opacity = '0';
    overlay.style.opacity = '0';

    setTimeout(() => {
      document.body.removeChild(overlay);
      document.removeEventListener('keydown', escHandler);
      if (onClose) onClose();
    }, 200);
  }

  // Controller cho dialog
  const controller = {
    // Mở dialog
    open() {
      // Thêm event listener cho ESC
      document.addEventListener('keydown', escHandler);

      // Animation khi mở
      setTimeout(() => {
        overlay.style.opacity = '1';
        dialogContainer.style.transform = 'scale(100%)';
        dialogContainer.style.opacity = '1';
      }, 10);

      return this;
    },
    // Đóng dialog
    close() {
      closeDialog();
      return this;
    },
    // Cập nhật nội dung
    updateContent(newContent) {
      const contentContainer = dialogContainer.querySelector('.dialog-content');
      contentContainer.innerHTML = '';

      if (typeof newContent === 'string') {
        contentContainer.innerHTML = newContent;
      } else if (newContent instanceof Node) {
        contentContainer.appendChild(newContent);
      } else if (typeof newContent === 'function') {
        contentContainer.appendChild(newContent());
      }

      return this;
    }
  };

  return controller;
}

// ---------------------------------
// COMPONENTS CHỨC NĂNG ĐẶC BIỆT
// ---------------------------------

/**
 * Tạo StatsCard để hiển thị số liệu
 * @param {object} options - Cấu hình stats card
 * @returns {HTMLElement} StatsCard element
 */
function StatsCard(options = {}) {
  const {
    title,
    value,
    subtitle,
    icon,
    color = 'blue',
    className = ''
  } = options;

  const darkMode = getDarkModeStatus();

  const bgColor = darkMode
    ? `bg-gray-800 hover:bg-gray-700`
    : `bg-white hover:bg-gray-50`;

  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const subtitleColor = darkMode ? 'text-gray-400' : 'text-gray-500';

  // Icon color variants
  const iconColors = {
    blue: darkMode ? 'text-blue-400' : 'text-blue-600',
    green: darkMode ? 'text-green-400' : 'text-green-600',
    amber: darkMode ? 'text-amber-400' : 'text-amber-600',
    purple: darkMode ? 'text-purple-400' : 'text-purple-600',
    red: darkMode ? 'text-red-400' : 'text-red-600',
  };

  const card = createElement('div', {
    className: `rounded-xl shadow-sm ${bgColor} p-4 border ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-all duration-200 ${className}`
  });

  // Animate with JS for hover
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-5px)';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0)';
  });

  const content = createElement('div', {
    className: 'flex justify-between items-start'
  });

  const textContainer = createElement('div');

  const titleElement = createElement('h3', {
    className: `text-sm font-medium ${subtitleColor}`
  }, title);
  textContainer.appendChild(titleElement);

  const valueElement = createElement('p', {
    className: `text-2xl font-bold mt-1 ${textColor}`
  }, value);
  textContainer.appendChild(valueElement);

  if (subtitle) {
    const subtitleElement = createElement('p', {
      className: `text-xs mt-1 ${subtitleColor}`
    }, subtitle);
    textContainer.appendChild(subtitleElement);
  }

  content.appendChild(textContainer);

  if (icon) {
    const iconContainer = createElement('div', {
      className: `p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`
    });

    const iconElement = createElement('span', {
      className: `w-5 h-5 ${iconColors[color] || iconColors.blue}`,
      innerHTML: icon
    });

    iconContainer.appendChild(iconElement);
    content.appendChild(iconContainer);
  }

  card.appendChild(content);

  return card;
}

/**
 * Tạo PageTitle component
 * @param {object} options - Cấu hình page title
 * @returns {HTMLElement} PageTitle element
 */
function PageTitle(options = {}) {
  const { title, subtitle, className = '' } = options;
  const darkMode = getDarkModeStatus();

  const container = createElement('div', {
    className: `mb-6 ${className}`
  });

  const titleElement = createElement('h1', {
    className: `text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`
  }, title);
  container.appendChild(titleElement);

  if (subtitle) {
    const subtitleElement = createElement('p', {
      className: `mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`
    }, subtitle);
    container.appendChild(subtitleElement);
  }

  // Animation xuất hiện
  setTimeout(() => {
    container.style.opacity = '1';
    container.style.transform = 'translateY(0)';
  }, 10);

  return container;
}

/**
 * Tạo ExpandableCard component có thể mở rộng/thu gọn
 * @param {object} options - Cấu hình expandable card
 * @returns {HTMLElement} ExpandableCard element
 */
function ExpandableCard(options = {}) {
  const {
    title,
    summary,
    details,
    icon,
    expanded = false,
    className = ''
  } = options;

  const darkMode = getDarkModeStatus();
  const cardClass = darkMode
    ? 'bg-gray-800 border-gray-700 text-gray-200'
    : 'bg-white border-gray-200 text-gray-700';

  const card = createElement('div', {
    className: `expandable-card rounded-xl shadow-sm border ${cardClass} ${className} overflow-hidden`
  });

  // Header luôn hiển thị
  const header = createElement('div', {
    className: 'card-header p-4 cursor-pointer flex justify-between items-center',
    onClick: toggleExpand
  });

  // Tiêu đề và icon
  const titleContainer = createElement('div', {
    className: 'flex items-center'
  });

  if (icon) {
    const iconElement = createElement('span', {
      className: 'mr-2',
      innerHTML: icon
    });
    titleContainer.appendChild(iconElement);
  }

  const titleElement = createElement('h3', {
    className: 'font-medium'
  }, title);
  titleContainer.appendChild(titleElement);

  header.appendChild(titleContainer);

  // Summary
  if (summary) {
    const summaryElement = createElement('div', {
      className: 'card-summary text-sm text-gray-500 dark:text-gray-400'
    }, summary);
    header.appendChild(summaryElement);
  }

  // Expand button
  const expandIcon = createSvgElement('svg', {
    width: '20',
    height: '20',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  });

  const expandIconPath = createSvgElement('path', {
    d: expanded ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'
  });

  expandIcon.appendChild(expandIconPath);
  header.appendChild(expandIcon);

  card.appendChild(header);

  // Details container (mặc định ẩn)
  const detailsContainer = createElement('div', {
    className: 'card-details overflow-hidden transition-all duration-300',
    style: {
      maxHeight: expanded ? '1000px' : '0',
      opacity: expanded ? '1' : '0',
      padding: expanded ? '0 1rem 1rem 1rem' : '0 1rem'
    }
  });

  if (details) {
    if (typeof details === 'string') {
      detailsContainer.innerHTML = details;
    } else if (details instanceof Node) {
      detailsContainer.appendChild(details);
    } else if (typeof details === 'function') {
      detailsContainer.appendChild(details());
    }
  }

  card.appendChild(detailsContainer);

  // Toggle expand/collapse
  function toggleExpand() {
    const isExpanded = detailsContainer.style.maxHeight !== '0px';

    if (isExpanded) {
      detailsContainer.style.maxHeight = '0';
      detailsContainer.style.opacity = '0';
      detailsContainer.style.padding = '0 1rem';
      expandIconPath.setAttribute('d', 'M6 9l6 6 6-6');
    } else {
      detailsContainer.style.maxHeight = '1000px';
      detailsContainer.style.opacity = '1';
      detailsContainer.style.padding = '0 1rem 1rem 1rem';
      expandIconPath.setAttribute('d', 'M18 15l-6-6-6 6');
    }
  }

  return card;
}

/**
 * Tạo DashboardHeader tổng hợp
 * @param {object} options - Cấu hình header
 * @returns {HTMLElement} Header element
 */
function DashboardHeader(options = {}) {
  const {
    title,
    date,
    notifications = [],
    onWeekNavigate,
    onToggleMetrics,
    showMetrics = true,
    isRealTimeMode = false,
    onToggleRealTime,
    onMarkAllRead
  } = options;

  const darkMode = getDarkModeStatus();
  const bgClass = darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900';
  const buttonClass = darkMode
    ? 'hover:bg-gray-700 focus:ring-gray-700'
    : 'hover:bg-gray-100 focus:ring-gray-200';

  const container = createElement('div', {
    className: 'dashboard-header flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4'
  });

  // Title section
  const titleSection = PageTitle({
    title: title || 'Hệ Thống Quản Lý Nhân Sự Kho Vận',
    subtitle: date ? `Ngày hiện tại: ${date}` : undefined
  });

  container.appendChild(titleSection);

  // Action buttons section
  const actionsSection = createElement('div', {
    className: 'flex flex-wrap gap-2'
  });

  // Week navigation buttons
  if (onWeekNavigate) {
    const prevWeekBtn = Button({
      text: 'Tuần trước',
      icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>',
      variant: 'outline',
      size: 'sm',
      className: buttonClass,
      onClick: () => onWeekNavigate('prev')
    });
    actionsSection.appendChild(prevWeekBtn);

    const nextWeekBtn = Button({
      text: 'Tuần sau',
      icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>',
      variant: 'outline',
      size: 'sm',
      className: buttonClass,
      onClick: () => onWeekNavigate('next')
    });
    actionsSection.appendChild(nextWeekBtn);
  }

  // Toggle metrics button
  if (onToggleMetrics) {
    const toggleMetricsBtn = Button({
      text: showMetrics ? "Ẩn chỉ số" : "Hiện chỉ số",
      icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"></rect><path d="M3 9h18"></path><path d="M9 21V9"></path></svg>',
      variant: 'outline',
      size: 'sm',
      className: buttonClass,
      onClick: onToggleMetrics
    });
    actionsSection.appendChild(toggleMetricsBtn);
  }

  // Real-time toggle
  if (onToggleRealTime) {
    const realTimeToggle = createElement('div', {
      className: 'flex items-center space-x-2'
    });

    const toggle = Switch({
      checked: isRealTimeMode,
      onChange: onToggleRealTime,
      id: 'real-time',
      label: 'Dữ liệu thời gian thực'
    });

    realTimeToggle.appendChild(toggle);
    actionsSection.appendChild(realTimeToggle);
  }

  // Notifications button
  if (notifications && notifications.length > 0) {
    const notifBtnContainer = createElement('div', {
      className: 'relative'
    });

    const notifBtn = Button({
      text: 'Thông báo',
      icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>',
      variant: 'outline',
      size: 'sm',
      className: buttonClass,
      onClick: () => toggleNotificationPanel()
    });

    // Thêm badge thông báo chưa đọc
    const unreadCount = notifications.filter(n => !n.read).length;
    if (unreadCount > 0) {
      const badge = createElement('span', {
        className: 'absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full'
      }, unreadCount);
      notifBtnContainer.appendChild(badge);
    }

    notifBtnContainer.appendChild(notifBtn);
    actionsSection.appendChild(notifBtnContainer);

    // Notification panel (mặc định ẩn)
    const notifPanel = createElement('div', {
      className: `notification-panel absolute right-0 mt-2 w-80 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-lg z-50 hidden`,
      style: {
        top: '100%'
      }
    });

    // Header panel
    const panelHeader = createElement('div', {
      className: `flex justify-between items-center border-b pb-2 p-3 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`
    });

    const panelTitle = createElement('h3', {
      className: 'font-medium'
    }, 'Thông báo');

    const markReadBtn = Button({
      text: 'Đánh dấu đã đọc',
      variant: 'ghost',
      size: 'sm',
      className: 'text-blue-500 hover:text-blue-600',
      onClick: () => {
        if (onMarkAllRead) onMarkAllRead();
        // Cập nhật UI
        notifPanel.querySelectorAll('.notification-item').forEach(item => {
          item.classList.remove(darkMode ? 'bg-blue-900/30 border-blue-800' : 'bg-blue-50 border-blue-200');
          item.classList.add(darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200');
        });
      }
    });

    panelHeader.appendChild(panelTitle);
    panelHeader.appendChild(markReadBtn);
    notifPanel.appendChild(panelHeader);

    // Notification content
    const notifContent = createElement('div', {
      className: 'max-h-72 overflow-y-auto p-3'
    });

    if (notifications.length === 0) {
      const emptyMsg = createElement('p', {
        className: `text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} text-center py-4`
      }, 'Không có thông báo mới');
      notifContent.appendChild(emptyMsg);
    } else {
      notifications.forEach(notification => {
        const notifItem = createElement('div', {
          className: `notification-item p-2 text-sm rounded border mb-2 ${
            notification.read
              ? darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
              : darkMode ? 'bg-blue-900/30 border-blue-800' : 'bg-blue-50 border-blue-200'
          }`
        });

        const itemContent = createElement('div', {
          className: 'flex justify-between items-start'
        });

        const text = createElement('span', {}, notification.text);
        const time = createElement('span', {
          className: `text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`
        }, notification.time);

        itemContent.appendChild(text);
        itemContent.appendChild(time);
        notifItem.appendChild(itemContent);
        notifContent.appendChild(notifItem);
      });
    }

    notifPanel.appendChild(notifContent);
    notifBtnContainer.appendChild(notifPanel);

    // Toggle notification panel function
    function toggleNotificationPanel() {
      const isVisible = notifPanel.style.display === 'block';
      notifPanel.style.display = isVisible ? 'none' : 'block';

      // Animation
      if (!isVisible) {
        notifPanel.style.opacity = '0';
        notifPanel.style.transform = 'translateY(-10px)';
        setTimeout(() => {
          notifPanel.style.opacity = '1';
          notifPanel.style.transform = 'translateY(0)';
        }, 10);
      }

      // Close panel khi click ra ngoài
      if (!isVisible) {
        document.addEventListener('click', closeOnClickOutside);
      }
    }

    // Close on click outside
    function closeOnClickOutside(e) {
      if (!notifBtnContainer.contains(e.target)) {
        notifPanel.style.display = 'none';
        document.removeEventListener('click', closeOnClickOutside);
      }
    }
  }

  container.appendChild(actionsSection);

  return container;
}

// ---------------------------------
// DASHBOARD LAYOUT VÀ COMPONENTS
// ---------------------------------

/**
 * Tạo OrderProgressCard hiển thị tiến độ xử lý đơn hàng
 * @param {object} options - Cấu hình order progress
 * @returns {HTMLElement} OrderProgressCard element
 */
function OrderProgressCard(options = {}) {
  const {
    orderProgress = { processed: 0, total: 0, percentage: 0 },
    isRealTimeMode = false
  } = options;

  const darkMode = getDarkModeStatus();
  const cardClass = darkMode
    ? 'bg-gray-800 border-gray-700 text-gray-200'
    : 'bg-white border-gray-200 text-gray-700';
  const textMutedClass = darkMode ? 'text-gray-400' : 'text-gray-500';

  const card = createElement('div', {
    className: `mb-6 p-4 border rounded-lg ${cardClass} shadow-sm`
  });

  // Header with title and status
  const header = createElement('div', {
    className: 'flex flex-col md:flex-row justify-between items-start md:items-center gap-4'
  });

  const titleSection = createElement('div');

  const title = createElement('h3', {
    className: 'text-lg font-semibold'
  }, 'Tiến độ xử lý đơn hàng hôm nay');

  const subtitle = createElement('p', {
    className: `text-sm ${textMutedClass}`
  }, `Đã xử lý ${orderProgress.processed} / ${orderProgress.total} đơn hàng (${orderProgress.percentage}%)`);

  titleSection.appendChild(title);
  titleSection.appendChild(subtitle);

  const statusSection = createElement('div', {
    className: 'flex items-center space-x-2'
  });

  const slaText = createElement('span', {
    className: `text-xs ${textMutedClass}`
  }, `SLA: ${isRealTimeMode ? 'Đang theo dõi' : 'Đạt 95%'}`);

  const statusBadge = Badge({
    text: orderProgress.percentage > 80 ? "Tốt" : "Cần đẩy nhanh",
    variant: orderProgress.percentage > 80 ? "success" : "warning"
  });

  statusSection.appendChild(slaText);
  statusSection.appendChild(statusBadge);

  header.appendChild(titleSection);
  header.appendChild(statusSection);

  // Progress bar
  const progressSection = createElement('div', {
    className: 'mt-4'
  });

  const progressBar = Progress({
    value: orderProgress.percentage,
    className: 'h-2 bg-gray-200 dark:bg-gray-700'
  });

  const progressLabels = createElement('div', {
    className: 'flex justify-between mt-1 text-xs'
  });

  progressLabels.appendChild(createElement('span', {}, '0%'));
  progressLabels.appendChild(createElement('span', {}, '50%'));
  progressLabels.appendChild(createElement('span', {}, '100%'));

  progressSection.appendChild(progressBar);
  progressSection.appendChild(progressLabels);

  card.appendChild(header);
  card.appendChild(progressSection);

  // Animation in
  setTimeout(() => {
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
  }, 10);

  return card;
}

/**
 * Tạo Dashboard Grid layout
 * @param {object} options - Cấu hình dashboard grid
 * @returns {HTMLElement} Dashboard Grid element
 */
function DashboardGrid(options = {}) {
  const { children = [], className = '' } = options;

  const grid = createElement('div', {
    className: `dashboard-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`
  });

  children.forEach(child => {
    if (child instanceof Node) {
      grid.appendChild(child);
    }
  });

  return grid;
}

/**
 * Tạo widget Phân tích 20/80
 * @param {object} options - Cấu hình widget
 * @returns {HTMLElement} Widget element
 */
function createParetoAnalysisWidget(options = {}) {
  const {
    kpis = { avgEfficiency: 0, topPerformerAvg: 0, topPerformers: [] },
    darkMode = false
  } = options;

  const container = createElement('div', {
    className: 'grid-cell'
  });

  const card = Card({
    title: 'Phân tích 20/80',
    content: () => {
      const content = createElement('div');

      // Explanation section
      const explanation = createElement('div', {
        className: `p-4 ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'} rounded-lg mb-4`
      });

      const explTitle = createElement('div', {
        className: 'font-medium mb-2'
      }, 'Ứng dụng nguyên tắc 20/80');

      const explText = createElement('div', {
        className: 'text-sm'
      });

      explText.appendChild(createElement('p', {},
        `${Math.ceil(kpis.topPerformers.length * 0.2)} nhân viên chính
        hàng đầu (20%) đóng góp 80% hiệu
        suất tổng thể. Hệ thống tự động ưu tiên phân công những
        nhân viên này vào các ngày cao điểm và công việc quan
        trọng.`
      ));

      const benefitsTitle = createElement('div', {
        className: 'mt-2 font-medium'
      }, 'Ưu điểm áp dụng');

      const benefitsList = createElement('ul', {
        className: 'list-disc list-inside mt-1 space-y-1'
      });

      ['Tối ưu hiệu suất xử lý đơn', 'Giảm thời gian đào tạo',
       'Tăng độ chính xác trong quy trình', 'Cân bằng khối lượng công việc'].forEach(benefit => {
        benefitsList.appendChild(createElement('li', {}, benefit));
      });

      explText.appendChild(benefitsTitle);
      explText.appendChild(benefitsList);
      explanation.appendChild(explTitle);
      explanation.appendChild(explText);

      // Top performers section
      const performersSection = createElement('div', {
        className: 'grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'
      });

      // Top performers list
      const topPerformersCard = createElement('div', {
        className: `p-4 border rounded-lg ${darkMode ? 'border-gray-700' : 'border-gray-200'}`
      });

      topPerformersCard.appendChild(createElement('div', {
        className: 'font-medium mb-3'
      }, 'Top performers (20%)'));

      const performersList = createElement('div', {
        className: 'space-y-2'
      });

      kpis.topPerformers.slice(0, 5).forEach((performer, idx) => {
        const item = createElement('div', {
          className: 'flex justify-between items-center'
        });

        item.appendChild(createElement('span', {
          className: 'text-sm'
        }, performer.name));

        item.appendChild(Badge({
          text: `${performer.efficiency}%`,
          variant: 'success'
        }));

        // Animation delay
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'translateX(0)';
        }, 100 + idx * 100);

        performersList.appendChild(item);
      });

      topPerformersCard.appendChild(performersList);
      performersSection.appendChild(topPerformersCard);

      // Role efficiency card
      const roleEfficiencyCard = createElement('div', {
        className: `p-4 border rounded-lg ${darkMode ? 'border-gray-700' : 'border-gray-200'}`
      });

      roleEfficiencyCard.appendChild(createElement('div', {
        className: 'font-medium mb-3'
      }, 'Hiệu suất theo vai trò'));

      const rolesList = createElement('div', {
        className: 'space-y-3'
      });

      // Dummy data for roles
      const roles = [
        { name: 'Picking', efficiency: 92 },
        { name: 'Packing', efficiency: 88 },
        { name: 'QC', efficiency: 95 }
      ];

      roles.forEach(role => {
        const roleItem = createElement('div', {
          className: 'space-y-1'
        });

        const roleHeader = createElement('div', {
          className: 'flex justify-between text-sm'
        });

        roleHeader.appendChild(createElement('span', {}, `${role.name}:`));
        roleHeader.appendChild(createElement('span', {}, `${role.efficiency}%`));

        const roleProgress = Progress({
          value: role.efficiency,
          className: 'h-2'
        });

        roleItem.appendChild(roleHeader);
        roleItem.appendChild(roleProgress);
        rolesList.appendChild(roleItem);
      });

      roleEfficiencyCard.appendChild(rolesList);
      performersSection.appendChild(roleEfficiencyCard);

      content.appendChild(explanation);
      content.appendChild(performersSection);

      // Simulated chart
      const chartContainer = createElement('div', {
        className: 'h-64 border rounded-lg p-4',
        innerHTML: `<div class="flex items-center justify-center h-full">
          <p class="text-center text-gray-500 dark:text-gray-400">Biểu đồ phân bố nhân sự theo vai trò<br>(PieChart Recharts)</p>
        </div>`
      });

      content.appendChild(chartContainer);

      return content;
    }
  });

  container.appendChild(card);

  return container;
}

/**
 * Tạo widget Tổng quan tuần
 * @param {object} options - Cấu hình widget
 * @returns {HTMLElement} Widget element
 */
function createWeeklyOverviewWidget(options = {}) {
  const {
    schedule = { currentWeek: [] },
    darkMode = false,
    staff = { regular: [], partTime: [] }
  } = options;

  const container = createElement('div', {
    className: 'grid-cell'
  });

  const card = Card({
    title: 'Tổng Quan Tuần Này',
    content: () => {
      const content = createElement('div');

      // Stats cards
      const statsGrid = createElement('div', {
        className: 'grid grid-cols-3 gap-4 mb-4'
      });

      const totalStaff = schedule.currentWeek.reduce((sum, day) => {
        const morningStaff = day.shifts.morning.regular.length + day.shifts.morning.partTime.length;
        const afternoonStaff = day.shifts.afternoon.regular.length + day.shifts.afternoon.partTime.length;
        return sum + morningStaff + afternoonStaff;
      }, 0);

      const specialEvents = schedule.currentWeek.filter(day => day.note).length;

      statsGrid.appendChild(StatsCard({
        title: "Nhân viên đã phân ca",
        value: totalStaff,
        subtitle: "theo lượt phân ca",
        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
        color: "blue",
        darkMode
      }));

      statsGrid.appendChild(StatsCard({
        title: "Mức độ tối ưu",
        value: "85%",
        subtitle: "dựa trên kỹ năng",
        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>',
        color: "green",
        darkMode
      }));

      statsGrid.appendChild(StatsCard({
        title: "Sự kiện đặc biệt",
        value: specialEvents,
        subtitle: "ngày cần lưu ý",
        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>',
        color: "amber",
        darkMode
      }));

      content.appendChild(statsGrid);

      // Workload distribution section
      const workloadSection = createElement('div', {
        className: 'space-y-2 mb-4'
      });

      workloadSection.appendChild(createElement('div', {
        className: 'font-medium'
      }, 'Phân bố khối lượng công việc'));

      // Chart container
      const chartContainer = createElement('div', {
        className: 'h-40 border rounded-lg p-2',
        innerHTML: `<div class="flex items-center justify-center h-full">
          <p class="text-center text-gray-500 dark:text-gray-400">Biểu đồ cột phân bố khối lượng theo ngày<br>(BarChart Recharts)</p>
        </div>`
      });

      workloadSection.appendChild(chartContainer);
      content.appendChild(workloadSection);

      // Special events section
      const eventsSection = createElement('div', {
        className: 'space-y-2'
      });

      eventsSection.appendChild(createElement('div', {
        className: 'font-medium'
      }, 'Sự kiện đặc biệt trong tuần'));

      const eventsList = createElement('div', {
        className: 'space-y-2'
      });

      const specialDays = schedule.currentWeek.filter(day => day.note);

      if (specialDays.length > 0) {
        specialDays.forEach((day, idx) => {
          const eventItem = createElement('div', {
            className: `p-3 border rounded-lg flex justify-between items-center ${darkMode ? 'border-gray-700' : 'border-gray-200'}`
          });

          const dayInfo = createElement('div');
          dayInfo.appendChild(createElement('div', {
            className: 'font-medium'
          }, `${day.dayName} (${day.date})`));

          dayInfo.appendChild(createElement('div', {
            className: `text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`
          }, `${day.forecast.ecomOrders} đơn`));

          eventItem.appendChild(dayInfo);

          const badgeVariant = day.note === "Container"
            ? "danger"
            : day.note === "Ngày đôi"
              ? "secondary"
              : "default";

          eventItem.appendChild(Badge({
            text: day.note,
            variant: badgeVariant
          }));

          // Animation delay for items
          setTimeout(() => {
            eventItem.style.opacity = '1';
            eventItem.style.transform = 'translateY(0)';
          }, 100 + idx * 100);

          eventsList.appendChild(eventItem);
        });
      } else {
        eventsList.appendChild(createElement('div', {
          className: `text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`
        }, 'Không có sự kiện đặc biệt'));
      }

      eventsSection.appendChild(eventsList);
      content.appendChild(eventsSection);

      return content;
    }
  });

  container.appendChild(card);

  return container;
}

/**
 * Tạo lịch làm việc tab content
 * @param {object} options - Cấu hình tab content
 * @returns {HTMLElement} Schedule tab content
 */
function createScheduleTabContent(options = {}) {
  const {
    schedule = { currentWeek: [] },
    darkMode = false,
    showAutoScheduleDialog,
    showForecastDialog,
    schedulingInProgress = false,
    openDayDetails = () => {}
  } = options;

  const container = createElement('div', {
    className: 'space-y-6'
  });

  // Tab header
  const header = createElement('div', {
    className: 'flex flex-col md:flex-row justify-between items-start md:items-center gap-4'
  });

  header.appendChild(createElement('h2', {
    className: 'text-xl font-bold'
  }, 'Lịch Làm Việc Tuần Này'));

  // Action buttons
  const actionButtons = createElement('div', {
    className: 'flex flex-wrap gap-2'
  });

  if (showAutoScheduleDialog) {
    actionButtons.appendChild(Button({
      text: 'Cài Đặt Phân Ca',
      icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>',
      variant: 'outline',
      onClick: showAutoScheduleDialog
    }));
  }

  if (showForecastDialog) {
    actionButtons.appendChild(Button({
      text: 'Tạo Dự Báo',
      icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"></rect><path d="M3 9h18"></path><path d="M9 21V9"></path></svg>',
      variant: 'outline',
      onClick: showForecastDialog
    }));
  }

  actionButtons.appendChild(Button({
    text: schedulingInProgress ? 'Đang xử lý...' : 'Tự Động Phân Ca',
    icon: schedulingInProgress
      ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>'
      : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>',
    disabled: schedulingInProgress
  }));

  header.appendChild(actionButtons);
  container.appendChild(header);

  // Lịch làm việc table
  const scheduleCard = Card({
    content: () => {
      const content = createElement('div', {
        className: 'pt-6'
      });

      const tableContainer = createElement('div', {
        className: 'overflow-x-auto'
      });

      const table = createElement('table', {
        className: 'w-full'
      });

      // Table header
      const tableHead = createElement('thead');
      const headerRow = createElement('tr', {
        className: `border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`
      });

      ['Ngày', 'Khối lượng', 'Ca Sáng', 'Ca Chiều', 'Ghi chú', 'Chi tiết'].forEach((heading, index) => {
        const th = createElement('th', {
          className: index === 5 ? 'p-2 text-right' : 'p-2 text-left',
        }, heading);
        headerRow.appendChild(th);
      });

      tableHead.appendChild(headerRow);
      table.appendChild(tableHead);

      // Table body
      const tableBody = createElement('tbody');

      schedule.currentWeek.forEach((day, index) => {
        const row = createElement('tr', {
          className: `border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`
        });

        // Date column
        const dateCell = createElement('td', { className: 'p-2' });
        const dateContent = createElement('div', { className: 'font-medium' }, day.dayName);
        const dateSubtext = createElement('div', {
          className: `text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`
        }, day.date);
        dateCell.appendChild(dateContent);
        dateCell.appendChild(dateSubtext);
        row.appendChild(dateCell);

        // Workload column
        const workloadCell = createElement('td', { className: 'p-2' });
        const workloadContent = createElement('div', { className: 'flex items-center' });

        const progressContainer = createElement('div', { className: 'w-24 mr-2' });
        progressContainer.appendChild(Progress({ value: day.forecast.totalWorkload }));

        workloadContent.appendChild(progressContainer);
        workloadContent.appendChild(createElement('span', { className: 'text-sm' },
          `${day.forecast.totalWorkload}%`));

        workloadCell.appendChild(workloadContent);
        workloadCell.appendChild(createElement('div', {
          className: `text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`
        }, `${day.forecast.ecomOrders} đơn`));

        row.appendChild(workloadCell);

        // Morning shift column
        const morningCell = createElement('td', { className: 'p-2' });

        const morningRegularBadge = Badge({
          text: `NV: ${day.shifts.morning.regular.length}`,
          variant: 'primary',
          className: 'mr-1'
        });

        const morningPartTimeBadge = Badge({
          text: `CTV: ${day.shifts.morning.partTime.length}`,
          variant: 'success'
        });

        morningCell.appendChild(morningRegularBadge);
        morningCell.appendChild(morningPartTimeBadge);
        row.appendChild(morningCell);

        // Afternoon shift column
        const afternoonCell = createElement('td', { className: 'p-2' });

        const afternoonRegularBadge = Badge({
          text: `NV: ${day.shifts.afternoon.regular.length}`,
          variant: 'secondary',
          className: 'mr-1'
        });

        const afternoonPartTimeBadge = Badge({
          text: `CTV: ${day.shifts.afternoon.partTime.length}`,
          variant: 'success'
        });

        afternoonCell.appendChild(afternoonRegularBadge);
        afternoonCell.appendChild(afternoonPartTimeBadge);
        row.appendChild(afternoonCell);

        // Note column
        const noteCell = createElement('td', { className: 'p-2' });

        if (day.note) {
          const noteBadge = Badge({
            text: day.note,
            variant: day.note === "Container"
              ? "danger"
              : day.note === "Ngày đôi"
                ? "secondary"
                : "default"
          });

          noteCell.appendChild(noteBadge);
        } else {
          noteCell.appendChild(createElement('span', {
            className: darkMode ? 'text-gray-400' : 'text-gray-500'
          }, '-'));
        }

        row.appendChild(noteCell);

        // Details column
        const detailsCell = createElement('td', { className: 'p-2 text-right' });

        const detailsButton = Button({
          text: 'Chi tiết',
          variant: 'ghost',
          size: 'sm',
          className: darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
          onClick: () => openDayDetails(day)
        });

        detailsCell.appendChild(detailsButton);
        row.appendChild(detailsCell);

        // Animation delay for rows
        setTimeout(() => {
          row.style.opacity = '1';
          row.style.transform = 'translateY(0)';
        }, 50 * index);

        tableBody.appendChild(row);
      });

      table.appendChild(tableBody);
      tableContainer.appendChild(table);

      content.appendChild(tableContainer);

      // Footer note
      content.appendChild(createElement('div', {
        className: `mt-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`
      }, `
        <p>
          Lịch làm việc được tự động phân bổ dựa trên khối lượng
          công việc và nhu cầu nhân sự. Bạn có thể điều chỉnh lịch
          làm việc theo nhu cầu thực tế.
        </p>
      `));

      return content;
    }
  });

  container.appendChild(scheduleCard);

  // Dự báo tuần tới và phân tích xu hướng
  const forecastGrid = createElement('div', {
    className: 'grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'
  });

  // Dự báo tuần tới card
  const nextWeekCard = Card({
    title: 'Dự Báo Tuần Tới',
    content: () => {
      const content = createElement('div', {
        className: 'space-y-4'
      });

      // Generate dummy forecast data
      const forecastDays = [
        { day: 'T2', orders: 470, workload: 85 },
        { day: 'T3', orders: 390, workload: 75 },
        { day: 'T4', orders: 520, workload: 90, event: 'Container' },
        { day: 'T5', orders: 450, workload: 85 },
        { day: 'T6', orders: 680, workload: 100, event: 'Ngày đôi' },
        { day: 'T7', orders: 350, workload: 65 },
        { day: 'CN', orders: 200, workload: 40 }
      ];

      const daysList = createElement('div', {
        className: 'space-y-4'
      });

      forecastDays.forEach((day, idx) => {
        const dayItem = createElement('div', {
          className: `flex items-center justify-between p-3 border rounded-lg ${darkMode ? 'border-gray-700' : 'border-gray-200'}`
        });

        const dayInfo = createElement('div');
        dayInfo.appendChild(createElement('div', {
          className: 'font-medium'
        }, day.day));

        const daySubtext = createElement('div', {
          className: `text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`
        }, `${day.orders} đơn`);

        if (day.event) {
          daySubtext.appendChild(Badge({
            text: day.event,
            variant: 'outline',
            className: 'ml-2'
          }));
        }

        dayInfo.appendChild(daySubtext);
        dayItem.appendChild(dayInfo);

        const workloadDisplay = createElement('div', {
          className: 'flex items-center'
        });

        const progressElement = Progress({
          value: day.workload,
          className: 'w-24 mr-2 h-2'
        });

        workloadDisplay.appendChild(progressElement);
        workloadDisplay.appendChild(createElement('span', {
          className: 'text-sm'
        }, `${day.workload}%`));

        dayItem.appendChild(workloadDisplay);

        // Animation
        setTimeout(() => {
          dayItem.style.opacity = '1';
          dayItem.style.transform = 'translateY(0)';
        }, 100 + idx * 100);

        daysList.appendChild(dayItem);
      });

      content.appendChild(daysList);

      const updateButton = Button({
        text: 'Cập nhật dự báo',
        icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"></path></svg>',
        variant: 'outline',
        className: 'mt-4 w-full flex items-center justify-center'
      });

      content.appendChild(updateButton);

      return content;
    }
  });

  // Phân tích xu hướng card
  const trendsCard = Card({
    title: 'Phân Tích Xu Hướng',
    content: () => {
      const content = createElement('div', {
        className: 'space-y-4'
      });

      // Workload distribution
      const workloadCard = createElement('div', {
        className: `p-4 border rounded-lg ${darkMode ? 'border-gray-700' : 'border-gray-200'}`
      });

      workloadCard.appendChild(createElement('div', {
        className: 'font-medium mb-2'
      }, 'Phân bổ khối lượng công việc'));

      const workloadList = createElement('div', {
        className: 'space-y-2'
      });

      const workloadTypes = [
        { name: 'Đơn hàng Ecom', value: 75 },
        { name: 'Container', value: 15 },
        { name: 'Chuyển kho', value: 10 }
      ];

      workloadTypes.forEach(type => {
        const typeItem = createElement('div', {
          className: 'space-y-1'
        });

        const typeHeader = createElement('div', {
          className: 'flex justify-between text-sm'
        });

        typeHeader.appendChild(createElement('span', {}, `${type.name}:`));
        typeHeader.appendChild(createElement('span', {}, `${type.value}%`));

        const typeProgress = Progress({
          value: type.value,
          className: 'h-2 mb-2'
        });

        typeItem.appendChild(typeHeader);
        typeItem.appendChild(typeProgress);

        workloadList.appendChild(typeItem);
      });

      workloadCard.appendChild(workloadList);
      content.appendChild(workloadCard);

      // Staffing forecast
      const staffingCard = createElement('div', {
        className: `p-4 border rounded-lg ${darkMode ? 'border-gray-700' : 'border-gray-200'}`
      });

      staffingCard.appendChild(createElement('div', {
        className: 'font-medium mb-2'
      }, 'Dự báo nhu cầu nhân sự'));

      const staffingList = createElement('div', {
        className: 'space-y-3'
      });

      const staffingTypes = [
        { role: 'Picking', value: '6.2 người/ngày', change: '+5%' },
        { role: 'Packing', value: '4.1 người/ngày', change: '+3%' },
        { role: 'QC', value: '2.8 người/ngày', change: '+2%' }
      ];

      staffingTypes.forEach(type => {
        const typeRow = createElement('div', {
          className: 'flex justify-between items-center'
        });

        typeRow.appendChild(createElement('span', {}, type.role + ':'));

        const valueContainer = createElement('div', {
          className: 'flex items-center'
        });

        valueContainer.appendChild(createElement('span', {
          className: 'mr-2'
        }, type.value));

        valueContainer.appendChild(Badge({
          text: type.change,
          variant: 'outline',
          className: 'text-xs'
        }));

        typeRow.appendChild(valueContainer);
        staffingList.appendChild(typeRow);
      });

      staffingCard.appendChild(staffingList);
      content.appendChild(staffingCard);

      // Download report button
      const downloadButton = Button({
        text: 'Tải xuống báo cáo dự báo',
        icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>',
        className: 'w-full mt-4 flex items-center justify-center',
        variant: 'outline'
      });

      content.appendChild(downloadButton);

      return content;
    }
  });

  forecastGrid.appendChild(nextWeekCard);
  forecastGrid.appendChild(trendsCard);

  container.appendChild(forecastGrid);

  return container;
}

/**
 * Tạo Performance tab content
 * @param {object} options - Cấu hình tab content
 * @returns {HTMLElement} Performance tab content
 */
function createPerformanceTabContent(options = {}) {
  const {
    kpis = { avgEfficiency: 0, topPerformerAvg: 0, topPerformers: [] },
    darkMode = false,
    staff = { regular: [], partTime: [] }
  } = options;

  const container = createElement('div', {
    className: 'space-y-6'
  });

  // KPI Stats
  const statsGrid = createElement('div', {
    className: 'grid grid-cols-1 md:grid-cols-3 gap-4'
  });

  // Average efficiency card
  const avgCard = Card({
    content: () => {
      const content = createElement('div');

      content.appendChild(createElement('div', {
        className: 'pb-2 border-b mb-2 border-gray-200 dark:border-gray-700'
      }, createElement('h3', {
        className: 'card-title'
      }, 'Hiệu Suất Trung Bình')));

      const statsSection = createElement('div', {
        className: 'flex justify-between items-center'
      });

      const value = createElement('div', {
        className: 'text-2xl font-bold'
      }, `${kpis.avgEfficiency}%`);

      const iconContainer = createElement('div', {
        className: `p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`
      });

      iconContainer.appendChild(createElement('span', {
        className: `w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`,
        innerHTML: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>'
      }));

      statsSection.appendChild(value);
      statsSection.appendChild(iconContainer);
      content.appendChild(statsSection);

      const progressSection = createElement('div', {
        className: 'mt-4'
      });

      progressSection.appendChild(Progress({
        value: parseFloat(kpis.avgEfficiency),
        className: 'h-2'
      }));

      const ratingText = parseFloat(kpis.avgEfficiency) >= 90
        ? "Xuất sắc"
        : parseFloat(kpis.avgEfficiency) >= 80
          ? "Tốt"
          : parseFloat(kpis.avgEfficiency) >= 70
            ? "Khá"
            : "Cần cải thiện";

      progressSection.appendChild(createElement('div', {
        className: `text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`
      }, ratingText));

      content.appendChild(progressSection);

      return content;
    },
     className: cardClass

  });

  // Top performers card
  const topCard = Card({
    content: () => {
      const content = createElement('div');

      content.appendChild(createElement('div', {
        className: 'pb-2 border-b mb-2 border-gray-200 dark:border-gray-700'
      }, createElement('h3', {
        className: 'card-title'
      }, 'Top 20% (Pareto)')));

      const statsSection = createElement('div', {
        className: 'flex justify-between items-center'
      });

      const value = createElement('div', {
        className: 'text-2xl font-bold'
      }, `${kpis.topPerformerAvg}%`);

      const iconContainer = createElement('div', {
        className: `p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`
      });

      iconContainer.appendChild(createElement('span', {
        className: `w-5 h-5 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`,
        innerHTML: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>'
      }));

      statsSection.appendChild(value);
      statsSection.appendChild(iconContainer);
      content.appendChild(statsSection);

      content.appendChild(createElement('div', {
        className: `text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`
      }, 'Hiệu suất top performers'));

      const progressSection = createElement('div', {
        className: 'mt-4'
      });

      progressSection.appendChild(Progress({
        value: parseFloat(kpis.topPerformerAvg),
        className: 'h-2'
      }));

      const ratingText = parseFloat(kpis.topPerformerAvg) >= 95
        ? "Xuất sắc"
        : "Tốt";

      progressSection.appendChild(createElement('div', {
        className: `text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`
      }, ratingText));

      content.appendChild(progressSection);

      return content;
    },
     className: cardClass

  });

  // Processing speed card
  const speedCard = Card({
    content: () => {
      const content = createElement('div');

      content.appendChild(createElement('div', {
        className: 'pb-2 border-b mb-2 border-gray-200 dark:border-gray-700'
      }, createElement('h3', {
        className: 'card-title'
      }, 'Tốc Độ Xử Lý')));

      const statsSection = createElement('div', {
        className: 'flex justify-between items-center'
      });

      const value = createElement('div', {
        className: 'text-2xl font-bold'
      }, '42 đơn/h');

      const iconContainer = createElement('div', {
        className: `p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`
      });

      iconContainer.appendChild(createElement('span', {
        className: `w-5 h-5 ${darkMode ? 'text-green-400' : 'text-green-600'}`,
        innerHTML: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"></rect><path d="M3 9h18"></path><path d="M9 21V9"></path></svg>'
      }));

      statsSection.appendChild(value);
      statsSection.appendChild(iconContainer);
      content.appendChild(statsSection);

      content.appendChild(createElement('div', {
        className: `text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`
      }, 'Mục tiêu: 40 đơn/h'));

      const progressSection = createElement('div', {
        className: 'mt-4'
      });

      progressSection.appendChild(Progress({
        value: 105,
        className: 'h-2'
      }));

      progressSection.appendChild(createElement('div', {
        className: `text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`
      }, 'Đạt 105% mục tiêu'));

      content.appendChild(progressSection);

      return content;
    },
    className: cardClass
  });

  statsGrid.appendChild(avgCard);
  statsGrid.appendChild(topCard);
  statsGrid.appendChild(speedCard);

  container.appendChild(statsGrid);

  // Top performers chart
  const topPerformersCard = Card({
    title: 'Top 5 Nhân Viên Hiệu Suất Cao',
    content: () => {
      const content = createElement('div', {
        className: 'h-64 border rounded-lg p-2',
        innerHTML: `<div class="flex items-center justify-center h-full">
          <p class="text-center text-gray-500 dark:text-gray-400">Biểu đồ cột hiệu suất theo nhân viên<br>(BarChart Recharts)</p>
        </div>`
      });

      return content;
    }
  });

  container.appendChild(topPerformersCard);

  // Role performance
  const roleCard = Card({
    title: 'Hiệu Suất Theo Vai Trò',
    content: () => {
      const content = createElement('div', {
         className: 'space-y-4'
      });

      // Role performance sections - Picking
      const pickingSection = createElement('div', {
        className: `p-4 border rounded-lg ${darkMode ? 'border-gray-700' : 'border-gray-200'}`
      });

      pickingSection.appendChild(createElement('h3', {
        className: 'font-medium mb-2'
      }, 'Picking'));

      const pickingDetails = createElement('div', {
        className: 'space-y-3'
      });

      // Calculate average efficiency for Picking
      const pickingStaff = staff.regular.filter(s => s.role === 'Picking');
      const pickingAvg = pickingStaff.length > 0
        ? Math.round(pickingStaff.reduce((sum, s) => sum + s.efficiency, 0) / pickingStaff.length)
        : 0;

      const pickingEfficiency = createElement('div', {
        className: 'space-y-1'
      });

      const pickingHeader = createElement('div', {
        className: 'flex justify-between text-sm'
      });

      pickingHeader.appendChild(createElement('span', {}, 'Hiệu suất trung bình:'));
      pickingHeader.appendChild(createElement('span', {}, `${pickingAvg}%`));

      pickingEfficiency.appendChild(pickingHeader);
      pickingEfficiency.appendChild(Progress({
        value: pickingAvg,
        className: 'h-2'
      }));

      pickingDetails.appendChild(pickingEfficiency);

      pickingDetails.appendChild(createElement('div', {
        className: `text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`
      }, 'Nhân viên Picking đảm nhận công việc chọn hàng từ các vị trí trong kho theo đơn đặt hàng.'));

      pickingSection.appendChild(pickingDetails);
      content.appendChild(pickingSection);

      // Role performance sections - Packing
      const packingSection = createElement('div', {
        className: `p-4 border rounded-lg ${darkMode ? 'border-gray-700' : 'border-gray-200'}`
      });

      packingSection.appendChild(createElement('h3', {
        className: 'font-medium mb-2'
      }, 'Packing'));

      const packingDetails = createElement('div', {
        className: 'space-y-3'
      });

      // Calculate average efficiency for Packing
      const packingStaff = staff.regular.filter(s => s.role === 'Packing');
      const packingAvg = packingStaff.length > 0
        ? Math.round(packingStaff.reduce((sum, s) => sum + s.efficiency, 0) / packingStaff.length)
        : 0;

      const packingEfficiency = createElement('div', {
        className: 'space-y-1'
      });

      const packingHeader = createElement('div', {
        className: 'flex justify-between text-sm'
      });

      packingHeader.appendChild(createElement('span', {}, 'Hiệu suất trung bình:'));
      packingHeader.appendChild(createElement('span', {}, `${packingAvg}%`));

      packingEfficiency.appendChild(packingHeader);
      packingEfficiency.appendChild(Progress({
        value: packingAvg,
        className: 'h-2'
      }));

      packingDetails.appendChild(packingEfficiency);

      packingDetails.appendChild(createElement('div', {
        className: `text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`
      }, 'Nhân viên Packing chịu trách nhiệm đóng gói sản phẩm đảm bảo an toàn cho quá trình vận chuyển.'));

      packingSection.appendChild(packingDetails);
      content.appendChild(packingSection);

      // Role performance sections - QC
      const qcSection = createElement('div', {
        className: `p-4 border rounded-lg ${darkMode ? 'border-gray-700' : 'border-gray-200'}`
      });

      qcSection.appendChild(createElement('h3', {
        className: 'font-medium mb-2'
      }, 'QC'));

      const qcDetails = createElement('div', {
        className: 'space-y-3'
      });

      // Calculate average efficiency for QC
      const qcStaff = staff.regular.filter(s => s.role === 'QC');
      const qcAvg = qcStaff.length > 0
        ? Math.round(qcStaff.reduce((sum, s) => sum + s.efficiency, 0) / qcStaff.length)
        : 0;

      const qcEfficiency = createElement('div', {
        className: 'space-y-1'
      });

      const qcHeader = createElement('div', {
        className: 'flex justify-between text-sm'
      });

      qcHeader.appendChild(createElement('span', {}, 'Hiệu suất trung bình:'));
      qcHeader.appendChild(createElement('span', {}, `${qcAvg}%`));

      qcEfficiency.appendChild(qcHeader);
      qcEfficiency.appendChild(Progress({
        value: qcAvg,
        className: 'h-2'
      }));

      qcDetails.appendChild(qcEfficiency);

      qcDetails.appendChild(createElement('div', {
        className: `text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`
      }, 'Nhân viên QC kiểm tra chất lượng và tính chính xác của đơn hàng trước khi đưa vào vận chuyển.'));

      qcSection.appendChild(qcDetails);
      content.appendChild(qcSection);

      return content;
    }
  });

  container.appendChild(roleCard);

  // Improvement suggestions
  const improvementCard = Card({
    title: 'Đề Xuất Cải Thiện',
    content: () => {
      const content = createElement('div', {
        className: 'space-y-4'
      });

      // Pareto improvement section
      const paretoSection = createElement('div', {
        className: `p-4 border rounded-lg ${darkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'}`
      });

      paretoSection.appendChild(createElement('h3', {
        className: 'font-medium mb-2'
      }, 'Cải thiện hiệu suất theo nguyên tắc 20/80'));

      const paretoContent = createElement('div', {
        className: 'text-sm'
      });

      paretoContent.appendChild(createElement('p', {}, `
        Theo phân tích Pareto, 20% nhân viên hiệu suất cao đang
        đóng góp 80% hiệu suất tổng thể. Để tối ưu hóa hiệu suất toàn kho, chúng tôi đề
        xuất:
      `));

      const suggestList = createElement('ul', {
        className: 'list-disc list-inside mt-2 space-y-1'
      });

      const suggestions = [
        'Tập trung phân công top performers vào các ngày cao điểm (Container, Ngày đôi)',
        'Ghép cặp nhân viên hiệu suất cao với nhân viên mới để đào tạo',
        'Phân tích và nhân rộng các phương pháp làm việc của nhóm hiệu suất cao',
        'Xây dựng chương trình động lực dựa trên hiệu suất thực tế'
      ];

      suggestions.forEach(suggestion => {
        suggestList.appendChild(createElement('li', {}, suggestion));
      });

      paretoContent.appendChild(suggestList);
      paretoSection.appendChild(paretoContent);
      content.appendChild(paretoSection);

      // Training plan
      const trainingSection = createElement('div', {
        className: `p-4 border rounded-lg ${darkMode ? 'border-gray-700' : 'border-gray-200'}`
      });

      trainingSection.appendChild(createElement('h3', {
        className: 'font-medium mb-2'
      }, 'Kế hoạch đào tạo'));

      const trainingContent = createElement('div', {
        className: 'space-y-3'
      });

      // Cross-training
      const crossTraining = createElement('div', {
        className: `p-3 ${darkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-100'} rounded border`
      });

      crossTraining.appendChild(createElement('div', {
        className: 'font-medium'
      }, 'Đào tạo chéo (Cross-training)'));

      crossTraining.appendChild(createElement('div', {
        className: 'text-sm mt-1'
      }, 'Đào tạo chéo kỹ năng giữa các nhóm Picking, Packing và QC để tăng tính linh hoạt trong phân công.'));

      trainingContent.appendChild(crossTraining);

      // Process optimization
      const processOpt = createElement('div', {
        className: `p-3 ${darkMode ? 'bg-yellow-900/20 border-yellow-800' : 'bg-yellow-50 border-yellow-100'} rounded border`
      });

      processOpt.appendChild(createElement('div', {
        className: 'font-medium'
      }, 'Tối ưu quy trình'));

      processOpt.appendChild(createElement('div', {
        className: 'text-sm mt-1'
      }, 'Tối ưu các quy trình làm việc dựa trên phương pháp của top performers. Tiêu chuẩn hóa các quy trình này.'));

      trainingContent.appendChild(processOpt);

      // Regular evaluation
      const evaluation = createElement('div', {
        className: `p-3 ${darkMode ? 'bg-purple-900/20 border-purple-800' : 'bg-purple-50 border-purple-100'} rounded border`
      });

      evaluation.appendChild(createElement('div', {
        className: 'font-medium'
      }, 'Đánh giá định kỳ'));

      evaluation.appendChild(createElement('div', {
        className: 'text-sm mt-1'
      }, 'Triển khai đánh giá hiệu suất hàng tuần kết hợp với đào tạo cải thiện có mục tiêu cụ thể.'));

      trainingContent.appendChild(evaluation);

      trainingSection.appendChild(trainingContent);
      content.appendChild(trainingSection);

      return content;
    }
  });

  container.appendChild(improvementCard);

  return container;
}

/**
 * Tạo Staff tab content
 * @param {object} options - Cấu hình tab content
 * @returns {HTMLElement} Staff tab content
 */
function createStaffTabContent(options = {}) {
  const {
    staff = { regular: [], partTime: [] },
    darkMode = false,
    onStaffSelect = () => {},
    staffFilter = { role: 'all', experience: 'all', efficiency: 'all' },
    onFilterChange = () => {},
    onResetFilters = () => {}
  } = options;

  const container = createElement('div', {
    className: 'space-y-6'
  });

  // Filter card
  const filterCard = Card({
    title: createElement('div', {
      className: 'flex justify-between items-center'
    }, [
      createElement('span', {}, 'Bộ lọc tìm kiếm'),
      Button({
        text: 'Đặt lại',
        icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"></path></svg>',
        variant: 'outline',
        size: 'sm',
        onClick: onResetFilters
      })
    ]),
    content: () => {
      const content = createElement('div', {
        className: 'grid grid-cols-1 md:grid-cols-3 gap-4'
      });

      const darkMode = getDarkModeStatus();
      const inputBgClass = darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300';

      // Role filter
      const roleContainer = createElement('div');

      roleContainer.appendChild(createElement('label', {
        className: 'block mb-2 text-sm font-medium'
      }, 'Vai trò'));

      const roleSelect = createElement('select', {
        className: `w-full px-3 py-2 rounded-md border ${inputBgClass} focus:outline-none focus:ring-2 focus:ring-blue-500`,
        value: staffFilter.role
      });

      [
        { value: 'all', label: 'Tất cả' },
        { value: 'Picking', label: 'Picking' },
        { value: 'Packing', label: 'Packing' },
        { value: 'QC', label: 'QC' }
      ].forEach(option => {
        const optionElement = createElement('option', {
          value: option.value
        }, option.label);

        if (staffFilter.role === option.value) {
          optionElement.selected = true;
        }

        roleSelect.appendChild(optionElement);
      });

      roleSelect.addEventListener('change', e => {
        onFilterChange({ ...staffFilter, role: e.target.value });
      });

      roleContainer.appendChild(roleSelect);
      content.appendChild(roleContainer);

      // Experience filter
      const expContainer = createElement('div');

      expContainer.appendChild(createElement('label', {
        className: 'block mb-2 text-sm font-medium'
      }, 'Kinh nghiệm'));

      const expSelect = createElement('select', {
        className: `w-full px-3 py-2 rounded-md border ${inputBgClass} focus:outline-none focus:ring-2 focus:ring-blue-500`,
        value: staffFilter.experience
      });

      [
        { value: 'all', label: 'Tất cả' },
        { value: 'junior', label: 'Dưới 1 năm' },
        { value: 'mid', label: '1-2 năm' },
        { value: 'senior', label: 'Trên 2 năm' }
      ].forEach(option => {
        const optionElement = createElement('option', {
          value: option.value
        }, option.label);

        if (staffFilter.experience === option.value) {
          optionElement.selected = true;
        }

        expSelect.appendChild(optionElement);
      });

      expSelect.addEventListener('change', e => {
        onFilterChange({ ...staffFilter, experience: e.target.value });
      });

      expContainer.appendChild(expSelect);
      content.appendChild(expContainer);

      // Efficiency filter
      const effContainer = createElement('div');

      effContainer.appendChild(createElement('label', {
        className: 'block mb-2 text-sm font-medium'
      }, 'Hiệu suất'));

      const effSelect = createElement('select', {
        className: `w-full px-3 py-2 rounded-md border ${inputBgClass} focus:outline-none focus:ring-2 focus:ring-blue-500`,
        value: staffFilter.efficiency
      });

      [
        { value: 'all', label: 'Tất cả' },
        { value: 'high', label: 'Cao (>90%)' },
        { value: 'medium', label: 'Trung bình (70-90%)' },
        { value: 'low', label: 'Thấp (<70%)' }
      ].forEach(option => {
        const optionElement = createElement('option', {
          value: option.value
        }, option.label);

        if (staffFilter.efficiency === option.value) {
          optionElement.selected = true;
        }

        effSelect.appendChild(optionElement);
      });

      effSelect.addEventListener('change', e => {
        onFilterChange({ ...staffFilter, efficiency: e.target.value });
      });

      effContainer.appendChild(effSelect);
      content.appendChild(effContainer);

      return content;
    }
  });

  container.appendChild(filterCard);

  // Filter staff based on current filters
  function getFilteredStaff() {
    let filtered = [...staff.regular];

    if (staffFilter.role !== 'all') {
      filtered = filtered.filter(s => s.role === staffFilter.role);
    }

    if (staffFilter.experience !== 'all') {
      filtered = filtered.filter(s => {
        switch (staffFilter.experience) {
          case 'junior':
            return s.experience < 12;
          case 'mid':
            return s.experience >= 12 && s.experience < 24;
          case 'senior':
            return s.experience >= 24;
          default:
            return true;
        }
      });
    }

    if (staffFilter.efficiency !== 'all') {
      filtered = filtered.filter(s => {
        switch (staffFilter.efficiency) {
          case 'high':
            return s.efficiency >= 90;
          case 'medium':
            return s.efficiency >= 70 && s.efficiency < 90;
          case 'low':
            return s.efficiency < 70;
          default:
            return true;
        }
      });
    }

    return filtered;
  }

  // Quick stats
  const filteredStaff = getFilteredStaff();
  const staffStats = createElement('div', {
    className: 'grid grid-cols-1 md:grid-cols-4 gap-4'
  });

  staffStats.appendChild(StatsCard({
    title: 'Nhân viên hiển thị',
    value: filteredStaff.length,
    subtitle: 'nhân viên chính thức',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
    color: 'blue',
    darkMode
  }));

  const avgEfficiency = filteredStaff.length > 0
    ? Math.round(filteredStaff.reduce((sum, s) => sum + s.efficiency, 0) / filteredStaff.length)
    : 0;

  staffStats.appendChild(StatsCard({
    title: 'Hiệu suất trung bình',
    value: `${avgEfficiency}%`,
    subtitle: 'của nhân viên đang hiển thị',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>',
    color: 'green',
    darkMode
  }));

  const avgExperience = filteredStaff.length > 0
    ? Math.round(filteredStaff.reduce((sum, s) => sum + s.experience, 0) / filteredStaff.length)
    : 0;

  staffStats.appendChild(StatsCard({
    title: 'Kinh nghiệm trung bình',
    value: `${avgExperience} tháng`,
    subtitle: 'của nhân viên đang hiển thị',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>',
    color: 'purple',
    darkMode
  }));

  const topPerformersCount = filteredStaff.filter(s => s.efficiency >= 90).length;

  staffStats.appendChild(StatsCard({
    title: 'Top performers',
    value: topPerformersCount,
    subtitle: 'nhân viên hiệu suất cao',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v8"></path><path d="M8 12h8"></path></svg>',
    color: 'amber',
    darkMode
  }));

  container.appendChild(staffStats);

  // Staff list
  const staffListCard = Card({
    title: createElement('div', {
      className: 'flex justify-between items-center'
    }, [
      createElement('span', {}, 'Danh sách nhân viên'),
      Button({
        text: 'Thêm nhân viên',
        icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>'
      })
    ]),
    content: () => {
      const content = createElement('div', {
        className: 'overflow-x-auto'
      });

      const table = createElement('table', {
        className: 'w-full'
      });

      // Table header
      const tableHead = createElement('thead');
      const headerRow = createElement('tr', {
        className: `border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`
      });

      ['Họ tên', 'Vai trò', 'Hiệu suất', 'Kinh nghiệm', 'Kỹ năng', 'Thao tác'].forEach((heading, index) => {
        const th = createElement('th', {
          className: index === 5 ? 'p-2 text-center' : 'p-2 text-left',
        }, heading);
        headerRow.appendChild(th);
      });

      tableHead.appendChild(headerRow);
      table.appendChild(tableHead);

      // Table body
      const tableBody = createElement('tbody');

      filteredStaff.forEach((s, index) => {
        const row = createElement('tr', {
          className: `border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`
        });

        // Name column
        const nameCell = createElement('td', { className: 'p-2' });
        const nameContent = createElement('div', { className: 'font-medium' }, s.name);
        nameCell.appendChild(nameContent);
        row.appendChild(nameCell);

        // Role column
        const roleCell = createElement('td', { className: 'p-2' });

        const roleBadge = Badge({
          text: s.role,
          variant: s.role === "Picking"
            ? "success"
            : s.role === "Packing"
              ? "primary"
              : "warning"
        });

        roleCell.appendChild(roleBadge);
        row.appendChild(roleCell);

        // Efficiency column
        const efficiencyCell = createElement('td', { className: 'p-2' });
        const efficiencyContent = createElement('div', { className: 'flex items-center' });

        const progressContainer = createElement('div', { className: 'w-24 h-2 mr-2' });
        progressContainer.appendChild(Progress({ value: s.efficiency }));

        efficiencyContent.appendChild(progressContainer);
        efficiencyContent.appendChild(createElement('span', {}, `${s.efficiency}%`));

        efficiencyCell.appendChild(efficiencyContent);
        row.appendChild(efficiencyCell);

        // Experience column
        const experienceCell = createElement('td', { className: 'p-2' });
        experienceCell.textContent = `${s.experience} tháng`;
        row.appendChild(experienceCell);

        // Skills column
        const skillsCell = createElement('td', { className: 'p-2' });
        const skillsContainer = createElement('div', { className: 'flex flex-wrap gap-1' });

        s.skills.forEach(skill => {
          skillsContainer.appendChild(Badge({
            text: skill,
            variant: 'outline',
            className: 'capitalize'
          }));
        });

        skillsCell.appendChild(skillsContainer);
        row.appendChild(skillsCell);

        // Actions column
        const actionsCell = createElement('td', { className: 'p-2' });
        const actionsContainer = createElement('div', { className: 'flex justify-center gap-2' });

        const viewButton = Button({
          icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="10" r="3"></circle><path d="M12 14a4 4 0 0 1-4 4h8a4 4 0 0 1-4-4z"></path></svg>',
          variant: 'ghost',
          size: 'sm',
          onClick: () => onStaffSelect(s)
        });

        const editButton = Button({
          icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon></svg>',
          variant: 'ghost',
          size: 'sm'
        });

        actionsContainer.appendChild(viewButton);
        actionsContainer.appendChild(editButton);
        actionsCell.appendChild(actionsContainer);
        row.appendChild(actionsCell);

        // Animation
        setTimeout(() => {
          row.style.opacity = '1';
          row.style.transform = 'translateY(0)';
        }, 30 * index);

        tableBody.appendChild(row);
      });

      table.appendChild(tableBody);
      content.appendChild(table);

      return content;
    }
  });

  container.appendChild(staffListCard);

  return container;
}

/**
 * Tạo Settings tab content
 * @param {object} options - Cấu hình tab content
 * @returns {HTMLElement} Settings tab content
 */
function createSettingsTabContent(options = {}) {
  const {
    settings = {
      productivityRatio: 80,
      workloadBalance: { morning: 55, afternoon: 45 },
      typeAllocation: { picking: 50, packing: 30, qc: 20 },
      minStaffPerRole: { picking: 2, packing: 1, qc: 1 }
    },
    darkMode = false,
    onSettingsChange = () => {},
    onAutoScheduleShifts = () => {}
  } = options;

  const container = createElement('div', {
    className: 'space-y-6'
  });

  // Thiết lập tham số phân ca card
  const paramsCard = Card({
    title: 'Thiết Lập Tham Số Phân Ca',
    content: () => {
      const content = createElement('div', {
        className: 'grid gap-6'
      });

      const inputBgClass = darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300';

      // Productivity ratio
      const ratioSection = createElement('div');

      ratioSection.appendChild(createElement('label', {
        className: 'mb-2 block'
      }, 'Nguyên tắc 20/80 - Tỷ lệ năng suất (%)'));

      const ratioContainer = createElement('div', {
        className: 'flex space-x-4 items-center'
      });

      ratioContainer.appendChild(createElement('span', {}, '50%'));

      const ratioSlider = createElement('input', {
        type: 'range',
        min: '50',
        max: '90',
        step: '5',
        value: settings.productivityRatio,
        className: `flex-1 ${inputBgClass}`
      });

      ratioSlider.addEventListener('input', e => {
        const newValue = parseInt(e.target.value);
        // Update UI immediately
        ratioValue.textContent = `${newValue}%`;
        ratioRemaining.textContent = `${100 - newValue}%`;

        // Update settings
        onSettingsChange({
          ...settings,
          productivityRatio: newValue
        });
      });

      ratioContainer.appendChild(ratioSlider);
      ratioContainer.appendChild(createElement('span', {}, '90%'));

      ratioSection.appendChild(ratioContainer);

      const ratioInfo = createElement('div', {
        className: 'flex justify-between text-sm text-gray-500 dark:text-gray-400'
      });

      const ratioValue = createElement('span', {}, `${settings.productivityRatio}% công việc do top performers xử lý`);
      const ratioRemaining = createElement('span', {}, `${100 - settings.productivityRatio}% còn lại`);

      ratioInfo.appendChild(ratioValue);
      ratioInfo.appendChild(ratioRemaining);

      ratioSection.appendChild(ratioInfo);
      content.appendChild(ratioSection);

      // Workload balance and role allocation
      const distributionGrid = createElement('div', {
        className: 'grid grid-cols-1 md:grid-cols-2 gap-6'
      });

      // Workload balance
      const workloadSection = createElement('div');

      workloadSection.appendChild(createElement('label', {
        className: 'mb-2 block'
      }, 'Phân bổ khối lượng công việc'));

      const workloadStats = createElement('div', {
        className: 'space-y-2'
      });

      // Morning
      const morningRow = createElement('div', {
        className: 'flex justify-between'
      });

      morningRow.appendChild(createElement('span', {}, 'Ca sáng:'));
      const morningValue = createElement('span', {}, `${settings.workloadBalance.morning}%`);
      morningRow.appendChild(morningValue);

      workloadStats.appendChild(morningRow);

      const morningSlider = createElement('div', {
        className: 'flex space-x-4 items-center'
      });

      morningSlider.appendChild(createElement('span', {}, '30%'));

      const morningInput = createElement('input', {
        type: 'range',
        min: '30',
        max: '70',
        step: '5',
        value: settings.workloadBalance.morning,
        className: `flex-1 ${inputBgClass}`
      });

      morningInput.addEventListener('input', e => {
        const morningVal = parseInt(e.target.value);
        const afternoonVal = 100 - morningVal;

        // Update UI
        morningValue.textContent = `${morningVal}%`;
        afternoonValue.textContent = `${afternoonVal}%`;

        // Update settings
        onSettingsChange({
          ...settings,
          workloadBalance: {
            morning: morningVal,
            afternoon: afternoonVal
          }
        });
      });

      morningSlider.appendChild(morningInput);
      morningSlider.appendChild(createElement('span', {}, '70%'));

      workloadStats.appendChild(morningSlider);

      // Afternoon
      const afternoonRow = createElement('div', {
        className: 'flex justify-between'
      });

      afternoonRow.appendChild(createElement('span', {}, 'Ca chiều:'));
      const afternoonValue = createElement('span', {}, `${settings.workloadBalance.afternoon}%`);
      afternoonRow.appendChild(afternoonValue);

      workloadStats.appendChild(afternoonRow);

      workloadSection.appendChild(workloadStats);
      distributionGrid.appendChild(workloadSection);

      // Role allocation
      const roleSection = createElement('div');

      roleSection.appendChild(createElement('label', {
        className: 'mb-2 block'
      }, 'Phân bổ theo vai trò'));

      const roleStats = createElement('div', {
        className: 'space-y-2'
      });

      // Picking
      const pickingRow = createElement('div', {
        className: 'flex justify-between'
      });

      pickingRow.appendChild(createElement('span', {}, 'Picking:'));
      const pickingValue = createElement('span', {}, `${settings.typeAllocation.picking}%`);
      pickingRow.appendChild(pickingValue);

      roleStats.appendChild(pickingRow);

      const pickingSlider = createElement('div', {
        className: 'flex space-x-4 items-center'
      });

      pickingSlider.appendChild(createElement('span', {}, '30%'));

      const pickingInput = createElement('input', {
        type: 'range',
        min: '30',
        max: '70',
        step: '5',
        value: settings.typeAllocation.picking,
        className: `flex-1 ${inputBgClass}`
      });

      pickingInput.addEventListener('input', e => {
        const pickingVal = parseInt(e.target.value);
        const remaining = 100 - pickingVal;

        // Calculate proportional values for packing and QC
        const packingRatio = Math.round(
          (settings.typeAllocation.packing /
            (settings.typeAllocation.packing + settings.typeAllocation.qc)) *
            remaining
        );
        const qcRatio = remaining - packingRatio;

        // Update UI
        pickingValue.textContent = `${pickingVal}%`;
        packingValue.textContent = `${packingRatio}%`;
        qcValue.textContent = `${qcRatio}%`;

        // Update settings
        onSettingsChange({
          ...settings,
          typeAllocation: {
            picking: pickingVal,
            packing: packingRatio,
            qc: qcRatio
          }
        });
      });

      pickingSlider.appendChild(pickingInput);
      pickingSlider.appendChild(createElement('span', {}, '70%'));

      roleStats.appendChild(pickingSlider);

      // Packing and QC
      const packingRow = createElement('div', {
        className: 'flex justify-between'
      });

      packingRow.appendChild(createElement('span', {}, 'Packing:'));
      const packingValue = createElement('span', {}, `${settings.typeAllocation.packing}%`);
      packingRow.appendChild(packingValue);

      roleStats.appendChild(packingRow);

      const qcRow = createElement('div', {
        className: 'flex justify-between'
      });

      qcRow.appendChild(createElement('span', {}, 'QC:'));
      const qcValue = createElement('span', {}, `${settings.typeAllocation.qc}%`);
      qcRow.appendChild(qcValue);

      roleStats.appendChild(qcRow);

      roleSection.appendChild(roleStats);
      distributionGrid.appendChild(roleSection);

      content.appendChild(distributionGrid);

      // Minimum staff per role
      const minStaffSection = createElement('div');

      minStaffSection.appendChild(createElement('label', {
        className: 'mb-2 block'
      }, 'Cài đặt số nhân viên tối thiểu'));

      const minStaffGrid = createElement('div', {
        className: 'grid grid-cols-1 md:grid-cols-3 gap-4'
      });

      // Picking minimum
      const minPickingContainer = createElement('div');

      minPickingContainer.appendChild(createElement('label', {
        className: 'text-sm',
        htmlFor: 'min-picking'
      }, 'Picking'));

      const minPickingInput = createElement('input', {
        id: 'min-picking',
        type: 'number',
        min: '1',
        value: settings.minStaffPerRole.picking,
        className: `w-full px-3 py-2 rounded-md border ${inputBgClass} focus:outline-none focus:ring-2 focus:ring-blue-500`
      });

      minPickingInput.addEventListener('input', e => {
        const value = parseInt(e.target.value);
        if (value > 0) {
          onSettingsChange({
            ...settings,
            minStaffPerRole: {
              ...settings.minStaffPerRole,
              picking: value
            }
          });
        }
      });

      minPickingContainer.appendChild(minPickingInput);
      minStaffGrid.appendChild(minPickingContainer);

      // Packing minimum
      const minPackingContainer = createElement('div');

      minPackingContainer.appendChild(createElement('label', {
        className: 'text-sm',
        htmlFor: 'min-packing'
      }, 'Packing'));

      const minPackingInput = createElement('input', {
        id: 'min-packing',
        type: 'number',
        min: '1',
        value: settings.minStaffPerRole.packing,
        className: `w-full px-3 py-2 rounded-md border ${inputBgClass} focus:outline-none focus:ring-2 focus:ring-blue-500`
      });

      minPackingInput.addEventListener('input', e => {
        const value = parseInt(e.target.value);
        if (value > 0) {
          onSettingsChange({
            ...settings,
            minStaffPerRole: {
              ...settings.minStaffPerRole,
              packing: value
            }
          });
        }
      });

      minPackingContainer.appendChild(minPackingInput);
      minStaffGrid.appendChild(minPackingContainer);

      // QC minimum
      const minQcContainer = createElement('div');

      minQcContainer.appendChild(createElement('label', {
        className: 'text-sm',
        htmlFor: 'min-qc'
      }, 'QC'));

      const minQcInput = createElement('input', {
        id: 'min-qc',
        type: 'number',
        min: '1',
        value: settings.minStaffPerRole.qc,
        className: `w-full px-3 py-2 rounded-md border ${inputBgClass} focus:outline-none focus:ring-2 focus:ring-blue-500`
      });

      minQcInput.addEventListener('input', e => {
        const value = parseInt(e.target.value);
        if (value > 0) {
          onSettingsChange({
            ...settings,
            minStaffPerRole: {
              ...settings.minStaffPerRole,
              qc: value
            }
          });
        }
      });

      minQcContainer.appendChild(minQcInput);
      minStaffGrid.appendChild(minQcContainer);

      minStaffSection.appendChild(minStaffGrid);
      content.appendChild(minStaffSection);

      // Save button
      const saveButton = Button({
        text: 'Lưu cài đặt',
        icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>',
        className: 'mt-4 flex items-center'
      });

      content.appendChild(saveButton);

      return content;
    }
  });

  container.appendChild(paramsCard);

  // Tối ưu hóa tự động card
  const optimizationCard = Card({
    title: 'Tối Ưu Hóa Tự Động',
    content: () => {
      const content = createElement('div', {
        className: 'space-y-4'
      });

      // Optimize workload toggle
      const workloadOptItem = createElement('div', {
        className: 'flex items-center space-x-2'
      });

      const workloadToggle = Switch({
        checked: true,
        id: 'optimize-workload',
        label: 'Cân bằng khối lượng công việc các ngày'
      });

      workloadOptItem.appendChild(workloadToggle);
      content.appendChild(workloadOptItem);

      // Avoid overtime toggle
      const overtimeOptItem = createElement('div', {
        className: 'flex items-center space-x-2'
      });

      const overtimeToggle = Switch({
        checked: true,
        id: 'avoid-overtime',
        label: 'Hạn chế tăng ca'
      });

      overtimeOptItem.appendChild(overtimeToggle);
      content.appendChild(overtimeOptItem);

      // Use flexibility toggle
      const flexibilityOptItem = createElement('div', {
        className: 'flex items-center space-x-2'
      });

      const flexibilityToggle = Switch({
        checked: true,
        id: 'use-flexibility',
        label: 'Tận dụng nhân viên đa kỹ năng'
      });

      flexibilityOptItem.appendChild(flexibilityToggle);
      content.appendChild(flexibilityOptItem);

      // Enforce day off toggle
      const dayoffOptItem = createElement('div', {
        className: 'flex items-center space-x-2'
      });

      const dayoffToggle = Switch({
        checked: true,
        id: 'enforce-dayoff',
        label: 'Đảm bảo ngày nghỉ cho mỗi nhân viên'
      });

      dayoffOptItem.appendChild(dayoffToggle);
      content.appendChild(dayoffOptItem);

      // Important note
      content.appendChild(Alert({
        title: 'Lưu ý quan trọng',
        description: `Thuật toán tự động phân ca dựa trên nguyên tắc 20/80
                (Pareto) và các tham số đã thiết lập. Đảm bảo rằng các
                thông số đã được cấu hình phù hợp trước khi thực hiện phân
                ca tự động.`,
        variant: 'primary',
        icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
        className: 'mt-4'
      }));

      // Optimize button
      const optimizeButton = Button({
        text: 'Tối ưu hóa và áp dụng cài đặt mới',
        icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"></path></svg>',
        className: 'w-full',
        onClick: onAutoScheduleShifts
      });

      content.appendChild(optimizeButton);

      return content;
    }
  });

  container.appendChild(optimizationCard);

  return container;
}

/**
 * Tạo bố cục Dashboard cho hệ thống quản lý nhân sự kho vận
 * @param {object} options - Cấu hình dashboard
 * @returns {HTMLElement} Dashboard element
 */
function createWarehouseStaffDashboard(options = {}) {
  const {
    darkMode = false,
    date = format(new Date(), 'dd/MM/yyyy'),
    isLoading = false
  } = options;

  // Simulation data
  const appState = {
    activeTab: 'overview',
    showMetrics: true,
    isRealTimeMode: false,
    notifications: [
      { id: 1, text: 'Nhân viên Lê Thị H đăng ký nghỉ phép ngày 10/03', time: '08:15', read: false },
      { id: 2, text: 'Container sẽ về kho trung tâm ngày 12/03', time: '09:30', read: false },
      { id: 3, text: '15 đơn P1 mới từ Shopee', time: '10:45', read: true }
    ],
    orderProgress: {
      processed: 189,
      total: 450,
      percentage: 42
    },
    staff: {
      regular: [
        { id: 1, name: 'Nguyễn Văn A', role: 'Picking', efficiency: 98, experience: 36, skills: ['picking', 'packing', 'qc'] },
        { id: 2, name: 'Trần Thị B', role: 'Picking', efficiency: 96, experience: 24, skills: ['picking', 'qc'] },
        { id: 3, name: 'Lê Văn C', role: 'Packing', efficiency: 90, experience: 18, skills: ['packing', 'picking'] }
        // ... thêm nhân viên nếu cần
      ],
      partTime: [
        { id: 101, name: 'CTV1', role: 'Picking', efficiency: 80, experience: 3, skills: ['picking'] },
        { id: 102, name: 'CTV2', role: 'Picking', efficiency: 78, experience: 2, skills: ['picking'] }
        // ... thêm nhân viên cộng tác nếu cần
      ]
    },
    schedule: {
      currentWeek: [
        {
          id: 1,
          date: '2025-03-10',
          dayName: 'T2',
          forecast: { ecomOrders: 450, container: false, storeTransfer: 3, totalWorkload: 85 },
          shifts: {
            morning: { regular: [1, 2, 3], partTime: [101, 102] },
            afternoon: { regular: [1, 3], partTime: [101] }
          },
          staffingNeeds: { picking: 6, packing: 4, qc: 3 },
          note: '',
          changeHistory: []
        },
        {
          id: 2,
          date: '2025-03-11',
          dayName: 'T3',
          forecast: { ecomOrders: 350, container: false, storeTransfer: 2, totalWorkload: 70 },
          shifts: {
            morning: { regular: [1, 2], partTime: [101] },
            afternoon: { regular: [1, 3], partTime: [] }
          },
          staffingNeeds: { picking: 5, packing: 3, qc: 2 },
          note: '',
          changeHistory: []
        },
        {
          id: 3,
          date: '2025-03-12',
          dayName: 'T4',
          forecast: { ecomOrders: 480, container: true, storeTransfer: 1, totalWorkload: 95 },
          shifts: {
            morning: { regular: [1, 2, 3], partTime: [101, 102] },
            afternoon: { regular: [1, 2, 3], partTime: [101, 102] }
          },
          staffingNeeds: { picking: 7, packing: 5, qc: 3 },
          note: 'Container',
          changeHistory: []
        }
        // ... thêm các ngày khác nếu cần
      ]
    },
    settings: {
      productivityRatio: 80,
      workloadBalance: { morning: 55, afternoon: 45 },
      typeAllocation: { picking: 50, packing: 30, qc: 20 },
      minStaffPerRole: { picking: 2, packing: 1, qc: 1 }
    },
    staffFilter: { role: 'all', experience: 'all', efficiency: 'all' }
  };

  // Background class based on dark mode
  const bgClass = darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900';

  // If loading, show skeleton UI
  if (isLoading) {
    const loadingSkeleton = createElement('div', {
      className: `${bgClass} p-4 md:p-6 min-h-screen transition-colors duration-200`
    });

    // Title skeleton
    loadingSkeleton.appendChild(createElement('div', {
      className: 'flex items-center justify-between mb-6'
    }, [
      createElement('div', { className: 'h-10 w-1/3 bg-gray-200 dark:bg-gray-700 rounded-md' }),
      createElement('div', { className: 'h-10 w-1/4 bg-gray-200 dark:bg-gray-700 rounded-md' })
    ]));

    // Cards skeleton
    const cardsSkeleton = createElement('div', {
      className: 'grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'
    });

    for (let i = 0; i < 3; i++) {
      cardsSkeleton.appendChild(createElement('div', {
        className: 'h-40 w-full bg-gray-200 dark:bg-gray-700 rounded-xl'
      }));
    }

    loadingSkeleton.appendChild(cardsSkeleton);

    // Content skeleton
    loadingSkeleton.appendChild(createElement('div', {
      className: 'h-60 w-full bg-gray-200 dark:bg-gray-700 rounded-lg mb-6'
    }));

    loadingSkeleton.appendChild(createElement('div', {
      className: 'h-60 w-full bg-gray-200 dark:bg-gray-700 rounded-lg'
    }));

    return loadingSkeleton;
  }

  // Main container
  const dashboard = createElement('div', {
    className: `${bgClass} p-4 md:p-6 transition-colors duration-200`
  });

  // Header
  dashboard.appendChild(DashboardHeader({
    title: 'Hệ Thống Quản Lý Nhân Sự Kho Vận',
    date,
    notifications: appState.notifications,
    onWeekNavigate: direction => {
      console.log(`Navigate week: ${direction}`);
      // Add navigation logic here
    },
    onToggleMetrics: () => {
      console.log('Toggle metrics');
      appState.showMetrics = !appState.showMetrics;
      // Re-render or update UI as needed
    },
    showMetrics: appState.showMetrics,
    isRealTimeMode: appState.isRealTimeMode,
    onToggleRealTime: value => {
      console.log(`Toggle real-time mode: ${value}`);
      appState.isRealTimeMode = value;
      // Update real-time features
    },
    onMarkAllRead: () => {
      console.log('Mark all notifications as read');
      appState.notifications = appState.notifications.map(n => ({ ...n, read: true }));
      // Update UI as needed
    },
    darkMode
  }));

  // Order progress card
  if (appState.showMetrics) {
    dashboard.appendChild(OrderProgressCard({
      orderProgress: appState.orderProgress,
      isRealTimeMode: appState.isRealTimeMode,
      darkMode
    }));
  }

  // Tabs navigation
  dashboard.appendChild(TabNavigation({
    tabs: [
      {
        value: 'overview',
        label: 'Tổng Quan',
        icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"></rect><path d="M3 9h18"></path><path d="M9 21V9"></path></svg>'
      },
      {
        value: 'schedule',
        label: 'Lịch Làm Việc',
        icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>'
      },
      {
        value: 'performance',
        label: 'Hiệu Suất',
        icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>'
      },
      {
        value: 'staff',
        label: 'Nhân Sự',
        icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>'
      },
      {
        value: 'settings',
        label: 'Cài Đặt',
        icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>'
      }
    ],
    activeTab: appState.activeTab,
    onTabChange: value => {
      console.log(`Tab changed to: ${value}`);
      appState.activeTab = value;
      // Re-render or update UI as needed
    }
  }));

  // Tab content container
  const tabContent = createElement('div', {
    className: 'tab-content'
  });
  dashboard.appendChild(tabContent);

  // Render appropriate tab content based on active tab
  switch(appState.activeTab) {
    case 'overview':
     // Create Pareto analysis widget for 20/80 principle
           const paretoWidget = createParetoAnalysisWidget({
             kpis: {
               avgEfficiency: '89.5',
               topPerformerAvg: '94.8',
               topPerformers: appState.staff.regular
                 .sort((a, b) => b.efficiency - a.efficiency)
                 .slice(0, Math.ceil(appState.staff.regular.length * 0.2))
        },
        darkMode
      })

      // Create weekly overview widget
      const weeklyWidget = createWeeklyOverviewWidget({
        schedule: appState.schedule,
        darkMode,
        staff: appState.staff
      });

      // Create dashboard grid
      const overviewContent = createElement('div', {
        className: 'space-y-6'
      });

      const overviewGrid = createElement('div', {
        className: 'grid grid-cols-1 md:grid-cols-2 gap-6'
      });

      overviewGrid.appendChild(paretoWidget);
      overviewGrid.appendChild(weeklyWidget);

      overviewContent.appendChild(overviewGrid);

      // Add scheduling complete notification if needed
      const schedulingComplete = true; // Example value - replace with actual state

      if (schedulingComplete) {
        overviewContent.appendChild(Alert({
          title: 'Phân ca hoàn tất!',
          description: `
            Hệ thống đã tự động phân ca cho toàn bộ tuần làm việc theo
            các nguyên tắc sau:
            <ul class="list-disc list-inside mt-2 space-y-1 text-sm">
              <li>Ưu tiên phân công ${Math.ceil(appState.staff.regular.length * 0.2)} top-performers vào ngày cao điểm</li>
              <li>Cân bằng kỹ năng và vai trò theo nhu cầu của từng ngày</li>
              <li>Phân bổ hợp lý giữa nhân viên chính thức và cộng tác viên</li>
              <li>Tối ưu chi phí vận hành nhưng vẫn đảm bảo hiệu suất</li>
              <li>Cân nhắc đến giờ làm việc và ngày nghỉ của nhân viên</li>
            </ul>
            <div class="mt-3 text-sm">Hiệu suất tổng thể: 85% - Cao hơn 7% so với phân ca thủ công trước đây</div>
          `,
          variant: 'success',
          icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
          className: 'mt-6'
        }));
      }

      tabContent.appendChild(overviewContent);
      break;

    case 'schedule':
      tabContent.appendChild(createScheduleTabContent({
        schedule: appState.schedule,
        darkMode,
        showAutoScheduleDialog: () => {
          console.log('Show auto schedule dialog');
          // Create and show dialog here
        },
        showForecastDialog: () => {
          console.log('Show forecast dialog');
          // Create and show dialog here
        },
        schedulingInProgress: false,
        openDayDetails: day => {
          console.log('Open day details', day);
          // Show day details dialog
        }
      }));
      break;

    case 'performance':
      const kpis = {
        avgEfficiency: '89.5',
        topPerformerAvg: '94.8',
        topPerformers: appState.staff.regular
          .sort((a, b) => b.efficiency - a.efficiency)
          .slice(0, Math.ceil(appState.staff.regular.length * 0.2))
      };

      tabContent.appendChild(createPerformanceTabContent({
        kpis,
        darkMode,
        staff: appState.staff
      }));
      break;

    case 'staff':
      tabContent.appendChild(createStaffTabContent({
        staff: appState.staff,
        darkMode,
        onStaffSelect: staff => {
          console.log('Staff selected', staff);
          // Show staff details dialog
        },
        staffFilter: appState.staffFilter,
        onFilterChange: newFilter => {
          console.log('Filter changed', newFilter);
          appState.staffFilter = newFilter;
          // Update UI as needed
        },
        onResetFilters: () => {
          console.log('Reset filters');
          appState.staffFilter = { role: 'all', experience: 'all', efficiency: 'all' };
          // Update UI as needed
        }
      }));
      break;

    case 'settings':
      tabContent.appendChild(createSettingsTabContent({
        settings: appState.settings,
        darkMode,
        onSettingsChange: newSettings => {
          console.log('Settings changed', newSettings);
          appState.settings = newSettings;
          // Update UI as needed
        },
        onAutoScheduleShifts: () => {
          console.log('Auto schedule shifts');
          // Implement auto scheduling logic
        }
      }));
      break;
  }

  dashboard.appendChild(tabContent);

  // Footer
  const footer = createElement('div', {
    className: `mt-8 text-center text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`
  });

  footer.appendChild(createElement('p', {}, `Dashboard Quản Lý Nhân Sự Kho Vận - ${date}`));
  footer.appendChild(createElement('p', {
    className: 'mt-1'
  }, 'Module được tối ưu hóa cho hiển thị trên desktop, tablet và mobile với hỗ trợ Dark Mode'));

  dashboard.appendChild(footer);

  return dashboard;
}

// ---------------------------------
// HELPER FUNCTIONS
// ---------------------------------

/**
 * Get current dark mode status
 * @returns {boolean} Dark mode status
 */
function getDarkModeStatus() {
  // In a real app, this would check localStorage, system preference, or context
  return document.documentElement.classList.contains('dark');
}

/**
 * Format date
 * @param {Date} date - Date to format
 * @param {string} formatStr - Format string
 * @returns {string} Formatted date
 */
function format(date, formatStr) {
  // Simple format function for demo - in real app use date-fns or similar
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return formatStr.replace('dd', day).replace('MM', month).replace('yyyy', year);
}

// ---------------------------------
// MAIN INITIALIZATION
// ---------------------------------

/**
 * Initialize the Warehouse Staff Management System
 * @param {string} containerId - Id of container element
 * @param {object} options - Configuration options
 */
function initWarehouseStaffSystem(containerId, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with id "${containerId}" not found.`);
    return;
  }

  // Get options with defaults
  const defaultOptions = {
    darkMode: false,
    date: format(new Date(), 'dd/MM/yyyy')
  };

  const mergedOptions = { ...defaultOptions, ...options };

  // Show loading state initially
  container.appendChild(createWarehouseStaffDashboard({
    ...mergedOptions,
    isLoading: true
  }));

  // Simulate loading data
  setTimeout(() => {
    // Remove loading state
    container.innerHTML = '';

    // Render full dashboard
    container.appendChild(createWarehouseStaffDashboard(mergedOptions));

    // Apply dark mode class to the document if needed
    if (mergedOptions.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, 800);
}

// Initialize the system
initWarehouseStaffSystem('app-container', {
  darkMode: getDarkModeStatus(),
  date: format(new Date(), 'dd/MM/yyyy')
});


// ---------------------------------
// EXPORTS
// ---------------------------------
export {
  createWarehouseStaffDashboard,
  initWarehouseStaffSystem,
  format,
  getDarkModeStatus
};

// ---------------------------------
// USAGE EXAMPLE

 initWarehouseStaffSystem('app-container', {
    darkMode: true,
    date: format(new Date(), 'dd/MM/yyyy'),
    isLoading: false
  });

      // Create settings card
   const settingsCard = Card({
      title: 'Cài Đặt',
         content: () => {
         const content = createElement('div', {
            className: 'space-y-4'
         });

         // Productivity ratio
         const productivitySection = createElement('div');

         productivitySection.appendChild(createElement('label', {
            className: 'mb-2 block'
         }, 'Tỷ lệ năng suất'));

         const productivityInput = createElement('input', {
            type: 'number',
            min: '0',
            max: '100',
            value: settings.productivityRatio,
            className: `w-full px-3 py-2 rounded-md border ${inputBgClass} focus:outline-none focus:ring-2 focus:ring-blue-500`
         });

         productivityInput.addEventListener('input', e => {
            const value = parseInt(e.target.value);
            if (value >= 0 && value <= 100) {
               onSettingsChange({
               ...settings,
               productivityRatio: value
               });
            }
         });

         productivitySection.appendChild(productivityInput);
         content.appendChild(productivitySection);

         // Workload distribution
         const distributionGrid = createElement('div', {
            className: 'grid grid-cols-1 md:grid-cols-2 gap-4'
         });

         // Workload balance
         const workloadSection = createElement('div');

         workloadSection.appendChild(createElement('label', {
            className: 'mb-2 block'
         }, 'Phân bổ khối lượng công việc'));

         const workloadStats = createElement('div', {
            className: 'space-y-2'
         });

         // Morning workload
         const morningRow = createElement('div', {
            className: 'flex justify-between'
         });

         morningRow.appendChild(createElement('span', {}, 'Ca sáng:'));
         const morningValue = createElement('span', {}, `${settings.workloadBalance.morning}%`);
         morningRow.appendChild(morningValue);

         workloadStats.appendChild(morningRow);

         // Afternoon workload
         const afternoonRow = createElement('div', {
            className: 'flex justify-between'
         });

         afternoonRow.appendChild(createElement('span', {}, 'Ca chiều:'));
         const afternoonValue = createElement('span', {}, `${settings.workloadBalance.afternoon}%`);

         afternoonRow.appendChild(afternoonValue);
            workloadStats.appendChild(afternoonRow);
         workloadSection.appendChild(workloadStats);
         distributionGrid.appendChild(workloadSection);

         content.appendChild(distributionGrid);
         return content;
      }
   });

container.appendChild(settingsCard);









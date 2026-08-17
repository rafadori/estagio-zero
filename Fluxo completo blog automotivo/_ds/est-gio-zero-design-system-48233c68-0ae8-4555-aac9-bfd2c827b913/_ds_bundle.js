/* @ds-bundle: {"format":4,"namespace":"EstGioZeroDesignSystem_48233c","components":[{"name":"PostCard","sourcePath":"components/content/PostCard.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"}],"sourceHashes":{"components/content/PostCard.jsx":"922d8e75ba3c","components/core/Badge.jsx":"d069aa0540b2","components/core/Button.jsx":"3c16dfce4c0e","components/core/Tag.jsx":"72ac39fe2ccf"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.EstGioZeroDesignSystem_48233c = window.EstGioZeroDesignSystem_48233c || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/content/PostCard.jsx
try { (() => {
function PostCard({
  title,
  excerpt,
  category,
  image,
  author,
  date,
  readTime,
  featured = false,
  href = '#'
}) {
  return /*#__PURE__*/React.createElement("a", {
    className: 'ez-postcard' + (featured ? ' ez-postcard--featured' : ''),
    href: href,
    style: {
      textDecoration: 'none',
      color: 'inherit'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ez-postcard__media"
  }, image ? /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: ""
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontFamily: 'var(--font-body)',
      color: 'var(--color-text-muted)'
    }
  }, "FOTO"), category ? /*#__PURE__*/React.createElement("span", {
    className: "ez-badge"
  }, category) : null), /*#__PURE__*/React.createElement("div", {
    className: "ez-postcard__body"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "ez-postcard__title"
  }, title), excerpt ? /*#__PURE__*/React.createElement("p", {
    className: "ez-postcard__excerpt"
  }, excerpt) : null, /*#__PURE__*/React.createElement("div", {
    className: "ez-postcard__meta"
  }, author ? /*#__PURE__*/React.createElement("span", null, author) : null, date ? /*#__PURE__*/React.createElement("span", null, date) : null, readTime ? /*#__PURE__*/React.createElement("span", null, readTime) : null)));
}
Object.assign(__ds_scope, { PostCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/PostCard.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function Badge({
  children,
  tone = 'accent'
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: 'ez-badge' + (tone === 'dark' ? ' ez-badge--dark' : '')
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  href,
  icon
}) {
  const cls = 'ez-btn ez-btn--' + variant + ' ez-btn--' + size;
  if (href) return /*#__PURE__*/React.createElement("a", {
    className: cls,
    href: href
  }, icon, children);
  return /*#__PURE__*/React.createElement("button", {
    className: cls,
    disabled: disabled,
    onClick: onClick
  }, icon, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function Tag({
  children,
  tone = 'default'
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: 'ez-tag' + (tone === 'accent' ? ' ez-tag--accent' : '')
  }, children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

__ds_ns.PostCard = __ds_scope.PostCard;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Tag = __ds_scope.Tag;

})();

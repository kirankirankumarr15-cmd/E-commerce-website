const ProductSection = ({ title, subtitle, children, action }) => (
  <section className="py-10 lg:py-16">
    <div className="container-narrow">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-text">{title}</h2>
          {subtitle && <p className="text-text-muted mt-1">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  </section>
);

export default ProductSection;

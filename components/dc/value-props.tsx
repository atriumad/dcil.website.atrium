import { Icon, type IconName } from "./icon";
import { cx } from "./utils";

export interface ValuePropItem {
  icon: IconName;
  title: string;
  text: string;
}

export function ValueProps({ items, className }: { items: ValuePropItem[]; className?: string }) {
  return (
    <div className={cx("dc-vp", className)}>
      {items.map((item) => (
        <div key={item.title} className="dc-vp-item">
          <Icon name={item.icon} size={30} className="dc-vp-icon" />
          <h3 className="dc-vp-title">{item.title}</h3>
          <p className="dc-vp-text">{item.text}</p>
        </div>
      ))}
    </div>
  );
}

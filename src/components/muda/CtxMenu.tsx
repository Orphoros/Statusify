import React, {useState, useCallback, type ReactNode} from 'react';
import {
	Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
} from '@heroui/react';
import {type IconProp} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

export type Item = {
	key: string;
	label?: string;
	disabled?: boolean;
	isSeparator?: boolean;
	shortcut?: string | ReactNode;
	icon?: IconProp;
	onClick?: () => void;
	color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | undefined;
};

type ContextMenuProps = {
	children: ReactNode;
	className?: string;
	menuItems: () => Item[];
};

export default function MudaContextMenu({children, menuItems, className}: ContextMenuProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [position, setPosition] = useState({x: 0, y: 0});
	const items = menuItems();

	const disabledKeys = items.filter(item => item.disabled).map(item => item.key);

	const handleContextMenu = useCallback((e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsOpen(true);
		setPosition({x: e.clientX, y: e.clientY});
	}, []);

	return (
		<div className={className} onContextMenu={handleContextMenu}>
			{children}
			<Dropdown isOpen={isOpen} onOpenChange={setIsOpen}>
				<DropdownTrigger>
					<span style={{position: 'fixed', left: position.x, top: position.y}} />
				</DropdownTrigger>
				<DropdownMenu disabledKeys={disabledKeys} aria-label='Context Menu'>
					{items.map(item => (
						<DropdownItem
							key={item.key}
							color={item.color}
							onPress={item.onClick}
							showDivider={item.isSeparator}
							shortcut={item.shortcut}
							startContent={item.icon && <FontAwesomeIcon icon={item.icon} />}
						>
							{item.label}
						</DropdownItem>
					))}
				</DropdownMenu>
			</Dropdown>
		</div>
	);
}

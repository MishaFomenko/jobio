import React, { useState, CSSProperties } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import { CustomDropdownProps, CustomMenuProps, CustomToggleProps } from '../types'

const CustomToggle: React.FC<CustomToggleProps> = React.forwardRef(
    ({ children, onClick }, ref: React.ForwardedRef<HTMLAnchorElement>) => (
        <a
            href=""
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}
        >
            {children}
            &#x25bc;
        </a>
    )
);


const CustomMenu: React.FC<CustomMenuProps> = React.forwardRef(
    (
        { children, style, className, 'aria-labelledby': labeledBy },
        ref: React.ForwardedRef<HTMLDivElement>
    ) => {
        const [value, setValue] = useState('');

        const extendedStyle: CSSProperties = {
            ...style,
            maxHeight: '300px',
            overflowY: 'auto'
        };

        return (
            <div
                ref={ref}
                style={extendedStyle}
                className={className + " mx-3"}
                aria-labelledby={labeledBy}
            >
                <Form.Control
                    autoFocus
                    className="my-2 w-100"
                    placeholder="Type to filter..."
                    onChange={(e) => setValue(e.target.value)}
                    value={value}
                />
                <ul className="list-unstyled mb-0">
                    {React.Children.toArray(children).filter(
                        (child) => {
                            if (!React.isValidElement(child)) {
                                return false;
                            }
                            return !value || child.props.children.toLowerCase().startsWith(value.toLowerCase());
                        }
                    )}
                </ul>
            </div>
        );
    }
);

const SearchDropdown: React.FC<CustomDropdownProps> = ({ searchBy, data, filterSetter, filter }) => {

    const handleItemClick = (e: React.ChangeEvent<any>) => {
        filterSetter(e.target.innerHTML)
        console.log(e.target.innerHTML)
    }

    return (
        <Dropdown className='m-4'>
            <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                Filter by {searchBy} {filter !== '' && ':' + filter}
            </Dropdown.Toggle>

            <Dropdown.Menu as={CustomMenu}>
                {data && data.map((item, ind) => (
                    <Dropdown.Item onClick={(e) => handleItemClick(e)} eventKey={ind} key={ind}>{item}</Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default SearchDropdown;
import React, { useState } from 'react';
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

        return (
            <div
                ref={ref}
                style={style}
                className={className}
                aria-labelledby={labeledBy}
            >
                <Form.Control
                    autoFocus
                    className="mx-3 my-2 w-auto"
                    placeholder="Type to filter..."
                    onChange={(e) => setValue(e.target.value)}
                    value={value}
                />
                <ul className="list-unstyled">
                    {React.Children.toArray(children).filter(
                        (child) =>
                            !value ||
                            (typeof child === 'string' &&
                                child.toLowerCase().startsWith(value))
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
                {data.map((item, ind) => (
                    <Dropdown.Item onClick={(e) => handleItemClick(e)} eventKey={ind} key={ind}>{item}</Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default SearchDropdown;
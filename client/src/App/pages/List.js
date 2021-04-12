/* eslint-disable */
import React, { useState, Component } from 'react';
import { Link } from 'react-router-dom';
import { withTransaction } from '@elastic/apm-rum-react'
import {
  Form,
  Input,
  Button,
  Radio,
  Select,
  Cascader,
  DatePicker,
  InputNumber,
  TreeSelect,
  Spin
} from 'antd';

import debounce from 'lodash/debounce';

class List extends Component {
  // Initialize the state
  constructor(props){
    super(props);
    this.state = {
      list: [],
      quickRes: ''
    }
  }

  // Fetch the list on first mount
  componentDidMount() {
    this.slowGetFruit();
  }

  // Retrieves the list of items from the Express app
  slowGetFruit = () => {
    fetch('/api/slowGetFruit')
    .then(res => res.json())
    .then(list => this.setState({ list }))
  }

  quickRequest = () => {
    fetch('/api/getQuickRequest')
    .then(res => res.json())
    .then(quickRes => {
      console.log(quickRes)
      this.setState({ quickRes })
    })
  }
  render() {
    const { list, quickRes } = this.state;

    return (
      <div className="App">
        <h1>List of Items</h1>
        {/* Check to see if any items are found*/}
        <button onClick={this.slowGetFruit}>slow request</button>
        {list.length ? (
          <div>
            {/* Render the list of items */}
            {list.map((item) => {
              return(
                <div>
                  {item}
                </div>
              );
            })}
          </div>
        ) : (
          <div>
            <h2>No List Items Found</h2>
          </div>
        )
      }
      <br></br>
      {
        <div>
          <button onClick={this.quickRequest}>quick request</button>
          <p>{quickRes}</p>
        </div>
      }
      <Link to={'/'}>
        <button variant="raised">
          go to Home Page
        </button>
      </Link>
      </div>
    );
  }
}

function DebounceSelect({ fetchOptions, debounceTimeout = 800, ...props }) {
  const [fetching, setFetching] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const fetchRef = React.useRef(0);
  const debounceFetcher = React.useMemo(() => {
    const loadOptions = (value) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);
      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }

        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);
  return (
    <Select
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      options={options}
    />
  );
} // Usage of DebounceSelect

async function fetchUserList(username) {
  console.log('fetching user', username);
  return fetch('https://randomuser.me/api/?results=5')
    .then((response) => response.json())
    .then((body) => {
      console.log('body', body)
      return body.results.map((user) => ({
        label: `${user.name.first} ${user.name.last}`,
        value: user.login.username,
      }))
    });
}

async function fetchFruit() {
  return fetch('/api/slowGetFruit')
    .then(res => res.json())
    .then(slowRes => {
      return slowRes.map((fruit) => (
        {
          label: fruit,
          value: fruit
        }
      ))
    })
}

const { Option } = Select;
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};


const FormSizeDemo = () => {
  const [componentSize, setComponentSize] = useState('default');
  const [value, setValue] = React.useState([]);
  const [slowValue, setSlowValue] = React.useState([]);
  
  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };

  return (
      <Form
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
        initialValues={{
          size: componentSize,
        }}
        onValuesChange={onFormLayoutChange}
        size={componentSize}
      >
        <Form.Item label="Form Size" name="size">
          <Radio.Group>
            <Radio.Button value="small">Small</Radio.Button>
            <Radio.Button value="default">Default</Radio.Button>
            <Radio.Button value="large">Large</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Input">
          <Input />
        </Form.Item>
        <Form.Item label="Select Fruit">
          <DebounceSelect
            mode="multiple"
            value={slowValue}
            placeholder="Select Fruit"
            fetchOptions={fetchFruit}
            onChange={(newValue) => {
              setSlowValue(newValue);
            }}
            style={{
              width: '100%',
            }}
          />
        </Form.Item>
        <Form.Item label="TreeSelect">
          <TreeSelect
            treeData={[
              {
                title: 'Light',
                value: 'light',
                children: [
                  {
                    title: 'Bamboo',
                    value: 'bamboo',
                  },
                ],
              },
            ]}
          />
        </Form.Item>
        <Form.Item label="Cascader">
          <Cascader
            options={[
              {
                value: 'zhejiang',
                label: 'Zhejiang',
                children: [
                  {
                    value: 'hangzhou',
                    label: 'Hangzhou',
                  },
                ],
              },
            ]}
          />
        </Form.Item>
        <Form.Item label="DatePicker">
          <DatePicker />
        </Form.Item>
        <Form.Item label="Search User">
          <DebounceSelect
            mode="multiple"
            value={value}
            placeholder="Select users"
            fetchOptions={fetchUserList}
            onChange={(newValue) => {
              setValue(newValue);
            }}
            style={{
              width: '100%',
            }}
          />
        </Form.Item>
      </Form>
  );
};

// export default withTransaction('List', 'component')(List)
// export default List;

export default FormSizeDemo;
import _ from 'lodash';

const baseMeta = {
  feature: { label: 'Feature', key: 'feature', type: 'string', widget: 'feature', required: true },
  name: { label: 'Name', key: 'name', type: 'string', widget: 'textbox', required: true },
  checkbox: { type: 'bool', widget: 'checkbox' },
  textbox: { type: 'string', widget: 'textbox' },
};

export function getMeta(cmdType, cmdArgs) {
  const meta = {};
  const fields = [];
  switch (cmdType) {
    case 'add-feature':
      fields.push(baseMeta.name);
      break;
    case 'add-action':
      fields.push(
        { ...baseMeta.feature, initialValue: cmdArgs.feature || null },
        { ...baseMeta.name },
        { ...baseMeta.checkbox, label: 'Async', key: 'async', tooltip: 'Whether the action is async using redux-middleware-thunk.' },
      );
      break;
    case 'add-component':
      fields.push(
        { ...baseMeta.feature, initialValue: cmdArgs.feature || null },
        { ...baseMeta.name },
        { ...baseMeta.checkbox, label: 'Connect store', key: 'connect', tooltip: 'Whether to connect to Redux store using react-redux' },
        { ...baseMeta.textbox, label: 'Url path', key: 'urlPath', tooltip: 'If provided, will create a route rule in React Router config.' },
      );
      break;
    case 'rename':
    case 'move':
      fields.push(
        cmdArgs.elementType !== 'feature' && { ...baseMeta.feature, initialValue: cmdArgs.feature, key: 'targetFeature', label: 'Target feature' },
        { ...baseMeta.name, initialValue: cmdArgs.elementName, key: 'newName', label: 'New name' },
      );
      break;
    default:
      console.log('Unknown cmd type: ', cmdType);
      break;
  }

  meta.fields = _.compact(fields);

  return meta;
}

export function convertArgs(values, cmdArgs) {
  console.log('cmd args: ', cmdArgs);
  switch (cmdArgs.type) {
    case 'add-feature':
      return {
        commandName: 'add',
        type: 'feature',
        name: values.name,
      };
    case 'add-action':
      return {
        commandName: 'add',
        type: 'action',
        name: `${values.feature}/${values.name}`,
        async: values.async,
      };
    case 'add-component':
      return {
        commandName: 'add',
        type: 'component',
        name: `${values.feature}/${values.name}`,
        urlPath: values.urlPath || false,
        connect: values.connect || false,
      };
    case 'move':
    case 'rename':
      return {
        commandName: 'move',
        type: cmdArgs.elementType,
        source: cmdArgs.elementType === 'feature' ? cmdArgs.feature : `${cmdArgs.feature}/${cmdArgs.elementName}`,
        target: cmdArgs.elementType === 'feature' ? values.newName : `${values.targetFeature}/${values.newName}`,
      };
    default:
      console.log('Unknown cmd type: ', cmdArgs.type);
      break;
  }
  return null;
}

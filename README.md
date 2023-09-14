# Dialogs
Easy modals and confirms using dialog elements.

## Usage
```
// Modal
const modal = new Dialog(<title>, <content>);

// With config options
const modal = new Dialog(<title>, <content>, {
    onClose: null,
    closeConfirm: false,
    closeConfirmText: 'Close this window?',
    closeConfirmButtonText: 'Ok',
    classes: []
});

// Confirm
if (await (new Confirm('Pls accept')).response()) {
    console.log('User accepted');
} else {
    console.log('User did not accept');
}

// Custom confirm yes/no buttons
new Confirm('Pls accept', {
    'cancel': 'No',
    'ok': 'All right then',
});
```

### Modal config options
`onClose`: closure to execute when closing the modal, or `null`  
`closeConfirm`: confirm closing of the modal with a `Confirm`  
`closeConfirmText`: text to show in the close confirmation window
`closeConfirmButtonText`: OK button text for close confirm
`classes`: CSS classes for the dialog element
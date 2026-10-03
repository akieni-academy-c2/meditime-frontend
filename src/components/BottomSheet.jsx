import { Sheet, SheetContent, SheetTitle, SheetDescription } from './ui/sheet.jsx';
import { useRef } from 'react';

export default function BottomSheet({ open, onOpenChange, title, description, children, footer, headerMedia, className = '' }) {
  const previousFocus = useRef(null);
  return <Sheet open={open} onOpenChange={onOpenChange}>
    <SheetContent side="bottom" className={`meditime-sheet ${className}`} onOpenAutoFocus={() => { previousFocus.current = document.activeElement; }} onCloseAutoFocus={event => { if (previousFocus.current?.isConnected) { event.preventDefault(); previousFocus.current.focus(); } }}>
      <div className="sheet-handle" aria-hidden="true" />
      <header>{headerMedia}<SheetTitle>{title}</SheetTitle>{description && <SheetDescription>{description}</SheetDescription>}</header>
      <div className="sheet-body">{children}</div>
      {footer && <footer className="sheet-actions">{footer}</footer>}
    </SheetContent>
  </Sheet>;
}

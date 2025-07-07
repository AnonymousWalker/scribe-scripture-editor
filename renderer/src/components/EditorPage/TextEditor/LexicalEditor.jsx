import React, {
  useEffect, useState, useRef, useMemo,
} from 'react';
import {
  Editor, getViewOptions, DEFAULT_VIEW_MODE, immutableNoteCallerNodeName, NoteEditor,
} from '@biblionexus-foundation/scribe-editor';

import NotesEditorHeader from './NotesEditorHeader';

export default function LexicalEditor({
  usjInput, onUsjChange, setNavRef, selectedFont, fontSize, textDirection, scrRef, setScrRef,
}) {
  const [usj, setUsj] = useState();
  const editorRef = useRef(null);
  const [isNoteEditorOpen, setIsNoteEditorOpen] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState('');

  const [viewMode] = useState(DEFAULT_VIEW_MODE);
  const viewOptions = useMemo(() => getViewOptions(viewMode), [viewMode]);

  const nodeOptions = {
    [immutableNoteCallerNodeName]: {
      onClick: (e) => {
        setIsNoteEditorOpen(true);
        setSelectedNoteId(e.currentTarget.getAttribute('data-caller-id'));
      },
    },
  };

  const onChange = async (updatedUsj) => {
    editorRef.current?.setUsj(updatedUsj);
    onUsjChange(updatedUsj);
  };

  useEffect(() => {
    if (usjInput) {
      setUsj(usjInput);
    }
  }, [usjInput]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (usj && editorRef.current) {
        editorRef.current.setUsj(usj);
      }
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [usj]);

  useEffect(() => {
    setNavRef(scrRef);
  }, [scrRef, setNavRef]);

  // Enhanced RTL detection and styling
  const isRTL = textDirection === 'rtl';
  const editorContainerStyle = {
    direction: isRTL ? 'rtl' : 'ltr',
    textAlign: isRTL ? 'right' : 'left',
  };

  const noteEditorStyle = {
    direction: isRTL ? 'rtl' : 'ltr',
    textAlign: isRTL ? 'right' : 'left',
  };

  return (
    <div className={`flex-grow flex flex-col overflow-hidden ${isRTL ? 'rtl-editor-container' : ''}`}>
      <div
        className={`flex-grow flex flex-col bg-gray-100 overflow-hidden ${isRTL ? 'rtl-content-editable' : ''}`}
        style={editorContainerStyle}
      >
        <Editor
          usjInput={usj}
          ref={editorRef}
          onChange={onUsjChange}
          viewOptions={viewOptions}
          nodeOptions={nodeOptions}
          scrRef={scrRef}
          setScrRef={setScrRef}
          textDirection={textDirection}
          font={selectedFont}
          fontSize={fontSize}
        />
      </div>

      {isNoteEditorOpen && (
        <div
          className={`flex-shrink-0 h-[300px] overflow-y-auto ${isRTL ? 'rtl-scrollbar' : ''}`}
          style={noteEditorStyle}
        >
          <NotesEditorHeader
            onClose={() => setIsNoteEditorOpen(false)}
            isRTL={isRTL}
          />
          <NoteEditor
            usj={usj}
            onChange={onChange}
            viewOptions={viewOptions}
            nodeOptions={nodeOptions}
            scrollId={selectedNoteId}
          />
        </div>
      )}
    </div>
  );
}

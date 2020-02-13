import React from 'react';
import { RouteComponentProps } from '@reach/router';
import { noteListReducer, initalState as noteListInitalState } from '../../reducers/noteList';
import { noteReducer, initalState as noteInitalState } from '../../reducers/note';
import { getNotesByModel, createNote, updateNote, deleteNotes } from '../../api/NotesAPI';
import styles from './Index.module.scss'
import { Menu, Icon, Button, Modal, Input, message, Popconfirm } from 'antd';
import MdEditor from 'for-editor';
import { INote } from '../../types';

const defaultEditorToorbar = {
  h1: true, // h1
  h2: true, // h2
  h3: true, // h3
  h4: true, // h4
  img: true, // 图片
  link: true, // 链接
  code: true, // 代码块
  preview: false, // 预览
  expand: false, // 全屏
  /* v0.0.9 */
  undo: true, // 撤销
  redo: true, // 重做
  save: true, // 保存
  /* v0.2.3 */
  subfield: false, // 单双栏模式
}

export default function Note({
  slug = '',
}: RouteComponentProps<{ slug: string }>) {
  const [{ notes, notesLoading, needRefreshCount, notesErrors }, notesDispatch] = React.useReducer(
    noteListReducer,
    noteListInitalState,
  );
  const [{ note, noteLoading, noteErrors }, noteDispatch] = React.useReducer(
    noteReducer,
    noteInitalState,
  );
  const [collapsed, setCollapsed] = React.useState<boolean>(false);
  const [editable, setEditable] = React.useState<boolean>(false);
  const [editNote, setEditNote] = React.useState<any>(null);
  const [noteTitle, setNoteTitle] = React.useState<string>('');
  const [addNoteVisible, setAddNoteVisible] = React.useState<boolean>(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  const changeNote = (item: any) => {
    const { key } = item;
    let currentNode = notes && notes.length ? notes[key] : {
      slug: '',
      name: '',
      content: '',
    };
    noteDispatch({
      type: 'UPDATE_NOTE',
      note: {
        slug: currentNode.slug,
        name: currentNode.name,
        content: currentNode.content || '',
      },
    });

  }
  const handleEditorChange = (value: string) => {
    noteDispatch({
      type: 'UPDATE_NOTE',
      note: {
        slug: note.slug,
        name: note.name,
        content: value,
      },
    });
  }
  const addImg = () => {
    message.info('Demo尚未开发图片上传功能，可以通过手动或编码自动上传到个人云存储进行保存，或者在github上完成编辑后复制过来', 5);
  }
  const onSave = async (value: string) => {
    noteDispatch({ type: 'FETCH_NOTE_BEGIN' });
    try {
      let result = await updateNote({ slug: note.slug, name: note.name, content: value })
      let resultNote = result.data.note;
      message.success('编辑文章成功！');
      noteDispatch({
        type: 'FETCH_NOTE_SUCCESS',
        payload: {
          note: resultNote,
        },
      });
      let tempNotes: Array<INote> = [];
      for (let item of notes) {
        if (resultNote.slug === item.slug) {
          item.content = resultNote.content;
        }
        tempNotes.push(item);
      }
      notesDispatch({
        type: 'FETCH_NOTELIST_SUCCESS',
        payload: {
          notes: tempNotes,
        },
      });
    } catch (errors) {
      console.log(errors);
      message.error('编辑文章失败，请自行保存当前文档稍后再试');
      noteDispatch({
        type: 'FETCH_NOTE_ERROR',
        noteErrors: errors,
      });
    }
  }
  const toggleEditable = () => {
    if (note.slug) {
      setEditable(!editable);
    } else {
      message.info('请先选中一篇文章');
    }
  }
  const showAddNoteTitle = () => {
    setEditNote({});
    setNoteTitle('');
    setAddNoteVisible(true);
  }
  const deleteNote = async (deleteNote: INote) => {
    notesDispatch({ type: 'FETCH_NOTELIST_BEGIN' });
    try {
      await deleteNotes(deleteNote.slug)
      message.success('删除文章成功！');
      let tempNotes: Array<INote> = [];
      for (let item of notes) {
        if (deleteNote.slug !== item.slug) {
          tempNotes.push(item);
        }
      }
      notesDispatch({
        type: 'FETCH_NOTELIST_SUCCESS',
        payload: {
          notes: tempNotes,
        },
      });
      let firstNotes = tempNotes && tempNotes.length ? tempNotes[0] : null;;
      if (firstNotes) {
        noteDispatch({
          type: 'UPDATE_NOTE',
          note: {
            slug: firstNotes.slug,
            name: firstNotes.name,
            content: firstNotes.content,
          },
        });
      }
    } catch (errors) {
      console.log(errors);
      message.error('删除文章失败');
      notesDispatch({
        type: 'FETCH_NOTELIST_ERROR',
        notesErrors: errors,
      });
    }
  }
  const editNoteTitle = (note: INote) => {
    setEditNote(note);
    setNoteTitle(note.name);
    setAddNoteVisible(true);
  }
  const submitNoteTitle = async () => {
    const isEdit = editNote.slug;
    if (!noteLoading) {
      noteDispatch({ type: 'FETCH_NOTE_BEGIN' });
      try {
        let result;
        if (isEdit) {
          result = await updateNote({ slug: editNote.slug, name: noteTitle })
        } else {
          result = await createNote(slug, { name: noteTitle })
        }
        message.success(isEdit ? '编辑文章标题成功！' : '添加文章成功！');
        setAddNoteVisible(false);
        noteDispatch({
          type: 'FETCH_NOTE_SUCCESS',
          payload: {
            note: result.data.note,
          },
        });
        notesDispatch({ type: 'UPDATE_REFRESH', needRefreshCount: needRefreshCount + 1 });
      } catch (errors) {
        console.log(errors);
        message.error(isEdit ? '编辑文章标题失败！' : '添加文章失败！');
        setAddNoteVisible(false);
        noteDispatch({
          type: 'FETCH_NOTE_ERROR',
          noteErrors: errors,
        });
      }
    }
  }
  React.useEffect(() => {
    notesDispatch({ type: 'FETCH_NOTELIST_BEGIN' });
    let ignore = false;

    const fetchNoteList = async () => {
      try {
        const [notePayload] = await Promise.all([
          getNotesByModel(slug),
        ]);
        let returnNotes = notePayload.data.notes && notePayload.data.notes.length ? notePayload.data.notes[0] : null;;
        if (!ignore) {
          if (!note.slug && returnNotes) {
            noteDispatch({
              type: 'UPDATE_NOTE',
              note: {
                slug: returnNotes.slug,
                name: returnNotes.name,
                content: returnNotes.content,
              },
            });
          }
          notesDispatch({
            type: 'FETCH_NOTELIST_SUCCESS',
            payload: {
              notes: notePayload.data.notes,
            },
          });
        }
      } catch (errors) {
        console.log(errors);
        notesDispatch({
          type: 'FETCH_NOTELIST_ERROR',
          notesErrors: errors,
        });
      }
    };

    fetchNoteList();
    return () => {
      ignore = true;
    };
  }, [notesDispatch, needRefreshCount, slug]);
  let currentMenu = '0';
  for (let [index, item] of Object.entries(notes)) {
    if (note.slug === item.slug) {
      currentMenu = index;
    }
  }
  return (
    <div className={styles.notesPage}>
      <Modal
        title={editNote && editNote.slug ? "修改文章标题" : "添加文章"}
        className={styles.modal}
        visible={addNoteVisible}
        onOk={submitNoteTitle}
        cancelText='取消'
        okText='提交'
        confirmLoading={noteLoading}
        onCancel={() => { setAddNoteVisible(false) }}
      >
        <Input size="large" value={noteTitle} onChange={(event: any) => {
          setNoteTitle(event.target.value)
        }} placeholder="请输入文章标题" />
      </Modal>
      <div className={styles.topBar}>
        <Button key="1" className={styles.btn} onClick={toggleCollapsed}>
          <Icon type={collapsed ? 'right' : 'left'} />
          {collapsed ? '展开导航' : '收起导航'}
        </Button>
        <Button key="2" className={styles.btn} onClick={showAddNoteTitle}>
          <Icon type="plus" />
          {'添加文章'}
        </Button>
        <Button key="3" className={styles.btn} onClick={toggleEditable}>
          <Icon type={editable ? 'eye' : 'edit'} />
          {editable ? '仅预览文档' : '编辑文档'}
        </Button>
      </div>
      <div className={styles.content}>
        <div className={styles.menu}>
          <Menu
            selectedKeys={[currentMenu]}
            mode="inline"
            className={styles.menuUl}
            onSelect={changeNote}
            inlineCollapsed={collapsed}
          >
            {notes.length ? notes.map((note, index) => {
              return (
                <Menu.Item key={index} >
                  <span>{note.name}</span>
                  <Popconfirm placement="right" title={'确认删除此文章？'}
                    onConfirm={() => {
                      deleteNote(note)
                    }} okText="删除" cancelText="取消">
                    <Icon className={styles.right} type={'delete'} />
                  </Popconfirm>
                  <Icon className={styles.right} type={'edit'} onClick={() => {
                    editNoteTitle(note)
                  }} />
                </Menu.Item>
              );
            }) : <span className={styles.emptyNotes}>此模块暂无文章</span>}
          </Menu>
        </div>
        <div className={`${styles.editorContainer} ${collapsed ? styles.collapsed : styles.uncollapsed}`}>
          <MdEditor value={note.content} preview={true} toolbar={editable ? defaultEditorToorbar : {}}
            subfield={editable} onChange={handleEditorChange} onSave={onSave} addImg={addImg} />
        </div>
      </div>
    </div >
  );
}

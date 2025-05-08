export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
export const TASK_STATUS_VIEWABLE_TEXT:{ [key: string]: { text: string; bg: string } } = {
    todo:{text:'To-Do',bg:'#FAC3FF'},
    inprogress:{text:'In-Progress',bg:"#85D9F1"},
    done:{text:'Done',bg:"#A2D6A0"}
}

export const STATUS_OPTIONS = [
    { value: 'todo', label: 'To Do',bg:"#FAC3FF" },
    { value: 'inprogress', label: 'In Progress',bg:"#85D9F1" },
    { value: 'done', label: 'Done',bg:"#A2D6A0" },
  ];
 
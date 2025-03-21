class ChangeTaskIdNullConstraintInWorkHours < ActiveRecord::Migration[7.1]
  def change
    # task_idのNOT NULL制約を外す
    change_column_null :work_hours, :task_id, true
  end
end

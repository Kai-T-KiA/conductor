class ChangeEndTimeNullConstraintInWorkHours < ActiveRecord::Migration[7.1]
  def change
    # end_timeのNOT NULL制約を外す
    change_column_null :work_hours, :end_time, true
  end
end


-- Create a profiles table to store additional user information
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for the profiles table
CREATE POLICY "Users can view their own profile" 
    ON public.profiles 
    FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
    ON public.profiles 
    FOR UPDATE 
    USING (auth.uid() = id);

-- Create a trigger to create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name');
  
  -- Create default categories for new users
  INSERT INTO public.categories (user_id, name, color, type)
  VALUES 
    (NEW.id, 'Salário', '#4CAF50', 'income'),
    (NEW.id, 'Investimento', '#2196F3', 'income'),
    (NEW.id, 'Outros', '#9E9E9E', 'income'),
    (NEW.id, 'Moradia', '#F44336', 'expense'),
    (NEW.id, 'Alimentação', '#FF9800', 'expense'),
    (NEW.id, 'Transporte', '#795548', 'expense'),
    (NEW.id, 'Lazer', '#E91E63', 'expense'),
    (NEW.id, 'Saúde', '#9C27B0', 'expense'),
    (NEW.id, 'Educação', '#3F51B5', 'expense'),
    (NEW.id, 'Contas', '#009688', 'expense'),
    (NEW.id, 'Outros', '#9E9E9E', 'expense');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for the notifications table
CREATE POLICY "Users can view their own notifications"
    ON public.notifications
    FOR SELECT
    USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(date);
CREATE INDEX IF NOT EXISTS idx_bills_due_date ON public.bills(due_date);

-- Create a function to generate bill notifications
CREATE OR REPLACE FUNCTION public.generate_bill_notifications()
RETURNS void AS $$
DECLARE
    bill_record RECORD;
BEGIN
    FOR bill_record IN
        SELECT b.id, b.user_id, b.description, b.due_date, b.amount
        FROM bills b
        WHERE b.status = 'pending' 
        AND b.due_date BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '3 days')
        AND NOT EXISTS (
            SELECT 1
            FROM notifications n
            WHERE n.user_id = b.user_id
            AND n.message LIKE 'Conta a pagar: ' || b.description || '%'
            AND n.created_at > CURRENT_DATE - INTERVAL '1 day'
        )
    LOOP
        INSERT INTO notifications (user_id, message, type)
        VALUES (
            bill_record.user_id,
            'Conta a pagar: ' || bill_record.description || ' de R$' || 
            bill_record.amount || ' vence em ' || 
            (bill_record.due_date - CURRENT_DATE) || ' dias',
            'bill'
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a stored procedure to copy recurring bills
CREATE OR REPLACE PROCEDURE public.process_recurring_bills()
LANGUAGE plpgsql
AS $$
DECLARE
    rec RECORD;
    new_due_date DATE;
BEGIN
    -- For each paid recurring bill, create a new bill for the next period
    FOR rec IN 
        SELECT * FROM public.bills 
        WHERE status = 'paid' AND recurrent = true
    LOOP
        -- Calculate next due date based on frequency
        IF rec.frequency = 'monthly' THEN
            new_due_date := (rec.due_date + INTERVAL '1 month')::DATE;
        ELSIF rec.frequency = 'weekly' THEN
            new_due_date := (rec.due_date + INTERVAL '1 week')::DATE;
        ELSIF rec.frequency = 'yearly' THEN
            new_due_date := (rec.due_date + INTERVAL '1 year')::DATE;
        END IF;
        
        -- Check if the bill already exists for the next period
        IF NOT EXISTS (
            SELECT 1 
            FROM public.bills 
            WHERE user_id = rec.user_id 
            AND description = rec.description 
            AND amount = rec.amount 
            AND due_date = new_due_date
        ) THEN
            -- Create new bill
            INSERT INTO public.bills (
                user_id, 
                description, 
                amount, 
                due_date, 
                status, 
                recurrent, 
                frequency
            ) VALUES (
                rec.user_id,
                rec.description,
                rec.amount,
                new_due_date,
                'pending',
                true,
                rec.frequency
            );
        END IF;
    END LOOP;
END;
$$;

-- Create a stored function to get monthly financial summary
CREATE OR REPLACE FUNCTION public.get_monthly_summary(
    user_id UUID,
    year INT,
    month INT
)
RETURNS TABLE (
    total_income NUMERIC,
    total_expense NUMERIC,
    balance NUMERIC,
    savings_rate NUMERIC
) AS $$
DECLARE
    start_date DATE := make_date(year, month, 1);
    end_date DATE := (make_date(year, month, 1) + INTERVAL '1 month')::DATE - INTERVAL '1 day';
    income NUMERIC := 0;
    expense NUMERIC := 0;
BEGIN
    -- Calculate total income for the month
    SELECT COALESCE(SUM(amount), 0) INTO income
    FROM transactions
    WHERE transactions.user_id = get_monthly_summary.user_id
    AND transactions.type = 'income'
    AND transactions.date BETWEEN start_date AND end_date;
    
    -- Calculate total expenses for the month
    SELECT COALESCE(SUM(amount), 0) INTO expense
    FROM transactions
    WHERE transactions.user_id = get_monthly_summary.user_id
    AND transactions.type = 'expense'
    AND transactions.date BETWEEN start_date AND end_date;
    
    -- Return the summary
    RETURN QUERY SELECT 
        income AS total_income,
        expense AS total_expense,
        (income - expense) AS balance,
        CASE 
            WHEN income > 0 THEN ((income - expense) / income * 100)
            ELSE 0
        END AS savings_rate;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


package consent

import future.keywords.if

default allow = false

allow if {
    input.third_party == "BudgetApp"
    input.data_field == "transaction_amount"
    input.expiry > time.now_ns()
}

resource "aws_sns_topic" "proposal_envelopes" {
  name = "proposal-envelopes-topic"
}

resource "aws_sqs_queue" "proposal_envelopes_queue" {
  name = "proposal-envelopes-queue"
}

resource "aws_sns_topic_subscription" "sqs_subscription" {
  topic_arn = aws_sns_topic.proposal_envelopes.arn
  protocol  = "sqs"
  endpoint  = aws_sqs_queue.proposal_envelopes_queue.arn
}

resource "aws_lambda_function" "proposal_processor" {
  function_name = "proposal-envelope-processor"
  handler       = "index.handler"
  runtime       = "nodejs18.x"
  role          = aws_iam_role.lambda_exec.arn
  filename      = "../src/dist/lambda.zip"
  source_code_hash = filebase64sha256("../src/dist/lambda.zip")
  environment {
    variables = {
      QUEUE_URL = aws_sqs_queue.proposal_envelopes_queue.id
    }
  }
}

resource "aws_lambda_event_source_mapping" "sqs_event" {
  event_source_arn = aws_sqs_queue.proposal_envelopes_queue.arn
  function_name    = aws_lambda_function.proposal_processor.arn
  enabled          = true
  batch_size       = 10
}

resource "aws_iam_role" "lambda_exec" {
  name = "lambda_exec_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_basic_execution" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "lambda_sqs_policy" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/AWSLambdaSQSQueueExecutionRole"
}

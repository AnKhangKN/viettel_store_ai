class AI_ChatController:
    def __init__(self, service):
        self.service = service

    def chat(self, request):
        user_input = request.get('input')
        response = self.service.generate_response(user_input)
        return response